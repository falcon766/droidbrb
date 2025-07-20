# Deploy DroidBRB to Netlify 🚀

## Quick Deployment Steps:

### Option 1: Drag & Drop (Easiest)
1. **Build the project:**
   ```bash
   cd client
   npm run build
   ```
2. **Go to [netlify.com](https://netlify.com)**
3. **Drag the `client/build` folder** to the Netlify dashboard
4. **Your site will be live instantly!**

### Option 2: Git Integration (Recommended)
1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```
2. **Connect to Netlify:**
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your repository
   - Set build settings:
     - **Build command:** `cd client && npm run build`
     - **Publish directory:** `client/build`
   - Click "Deploy site"

### Option 3: Netlify CLI
1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```
2. **Deploy:**
   ```bash
   cd client
   npm run build
   netlify deploy --prod --dir=build
   ```

## Environment Variables (if needed):
If you add Firebase or other services later, add these in Netlify:
- Go to Site Settings > Environment Variables
- Add your API keys and configuration

## Custom Domain (Optional):
- Go to Site Settings > Domain Management
- Add your custom domain

## Automatic Deployments:
With Git integration, every push to main will automatically deploy!

---
**Your DroidBRB site will be live at:** `https://your-site-name.netlify.app` 