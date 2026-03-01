import {setGlobalOptions} from "firebase-functions";
import {onSchedule} from "firebase-functions/v2/scheduler";
import {defineSecret} from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import sgMail from "@sendgrid/mail";

admin.initializeApp();

setGlobalOptions({maxInstances: 10});

const sendgridApiKey = defineSecret("SENDGRID_API_KEY");

const FROM_EMAIL = "mark@nophster.com";
const FROM_NAME = "DroidBRB";
const APP_URL = "https://droidbrb.netlify.app";

/**
 * Runs every 5 minutes. Finds messages that:
 * - Are unread (isRead === false)
 * - Were sent more than 10 minutes ago
 * - Haven't triggered a notification (notificationSent !== true)
 *
 * Sends an email to the receiver and marks notificationSent.
 */
export const checkUnreadMessages = onSchedule(
  {
    schedule: "every 5 minutes",
    region: "us-central1",
    secrets: [sendgridApiKey],
  },
  async () => {
    const db = admin.firestore();
    const cutoff = new Date(Date.now() - 10 * 60 * 1000);

    try {
      const snapshot = await db
        .collection("messages")
        .where("isRead", "==", false)
        .where(
          "createdAt",
          "<=",
          admin.firestore.Timestamp.fromDate(cutoff)
        )
        .get();

      if (snapshot.empty) {
        logger.info("No unread messages older than 10 min.");
        return;
      }

      const unnotified = snapshot.docs.filter(
        (doc) => !doc.data().notificationSent
      );

      if (unnotified.length === 0) {
        logger.info("All old unread messages already notified.");
        return;
      }

      logger.info(
        `Found ${unnotified.length} unread messages to notify.`
      );

      sgMail.setApiKey(sendgridApiKey.value());

      for (const doc of unnotified) {
        const msg = doc.data();
        let email = msg.receiverEmail;

        if (!email) {
          const userDoc = await db
            .collection("users")
            .doc(msg.receiverId)
            .get();
          email = userDoc.exists ?
            userDoc.data()?.email :
            null;

          if (!email) {
            logger.warn(
              `No email for receiver ${msg.receiverId}`
            );
            await doc.ref.update({notificationSent: true});
            continue;
          }
        }

        const subject =
          `New message from ${msg.senderName} on DroidBRB`;
        const textBody = [
          `Hi ${msg.receiverName},`,
          "",
          "You have an unread message from " +
            `${msg.senderName}:`,
          "",
          `"${msg.content}"`,
          "",
          "Log in to DroidBRB to reply.",
          "",
          `${APP_URL}/messages`,
        ].join("\n");
        const htmlBody = [
          "<div style=\"font-family: sans-serif;" +
            " max-width: 600px; margin: 0 auto;\">",
          "<h2 style=\"color: #111111;\">" +
            "New message on DroidBRB</h2>",
          `<p>Hi ${msg.receiverName},</p>`,
          "<p>You have an unread message from " +
            `<strong>${msg.senderName}</strong>:</p>`,
          "<blockquote style=\"border-left: 3px solid" +
            " #2563EB; padding: 12px 16px;" +
            " margin: 16px 0; background: #f5f5f3;" +
            " color: #444444;\">",
          `${msg.content}`,
          "</blockquote>",
          `<a href="${APP_URL}/messages"`,
          " style=\"display: inline-block;" +
            " background: #2563EB; color: white;" +
            " padding: 12px 28px;" +
            " border-radius: 100px;" +
            " text-decoration: none;" +
            " font-weight: 500;\">",
          "View Message</a>",
          "<p style=\"color: #999999;" +
            " font-size: 13px; margin-top: 24px;\">",
          "You received this because you have an " +
            "unread message on DroidBRB.</p>",
          "</div>",
        ].join("\n");

        try {
          await sgMail.send({
            to: email,
            from: {email: FROM_EMAIL, name: FROM_NAME},
            subject,
            text: textBody,
            html: htmlBody,
          });

          await doc.ref.update({notificationSent: true});
          logger.info(
            `Email sent to ${email} for message ${doc.id}`
          );
        } catch (emailError) {
          logger.error(
            `Failed to send email for ${doc.id}:`,
            emailError
          );
        }
      }
    } catch (error) {
      logger.error("Error checking unread messages:", error);
    }
  }
);
