# Firebase Domain Authorization Fix

## 🔥 **Error: Firebase: Error (auth/unauthorized-domain)**

This error occurs because your domain `droidbrb.com` is not authorized in Firebase Authentication.

## 📋 **Step-by-Step Fix:**

### 1. Go to Firebase Console
- Visit [Firebase Console](https://console.firebase.google.com/)
- Select your DroidBRB project

### 2. Navigate to Authentication Settings
- Click on **Authentication** in the left sidebar
- Click on the **Settings** tab (gear icon)
- Scroll down to **Authorized domains**

### 3. Add Your Domain
- Click **Add domain**
- Add: `droidbrb.com`
- Click **Add**

### 4. Also Add Netlify Domain (if needed)
- Add: `cosmic-melba-031c3d.netlify.app`
- This is your Netlify preview domain

### 5. Save Changes
- Click **Save** at the bottom

## ✅ **Expected Result:**
After adding the domains, Google authentication should work properly on both:
- `https://droidbrb.com`
- `https://cosmic-melba-031c3d.netlify.app`

## 🔧 **Alternative: Test with Localhost**
If you want to test locally first, also add:
- `localhost`
- `127.0.0.1`

## 🚨 **Important Notes:**
- Changes may take a few minutes to propagate
- Make sure you're using HTTPS in production
- The domain must match exactly (including protocol)

## 🆘 **Still Having Issues?**
1. Check that Google Authentication is enabled in Firebase
2. Verify your Firebase config in `.env.local`
3. Clear browser cache and try again
4. Check Firebase console logs for more details

---

**After making these changes, Google authentication should work perfectly!** 🎉 