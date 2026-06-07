# Health & Fitness App MVP (Copy)

This is a code bundle for Health & Fitness App MVP (Copy). The original project is available at https://www.figma.com/design/YJbnkPQPmyDYDhPN1Vxgec/Health---Fitness-App-MVP--Copy-.

## 🚀 Running the Development Server

### Quick Start (Recommended)
```bash
npm run dev-auto
```
This will automatically install dependencies and start the development server with auto-reload.

### Alternative Methods

**Method 1: Install + Start**
```bash
npm install
npm run dev
```

**Method 2: Auto-reload with Watch**
```bash
npm run dev-watch
```

**Method 3: Clean Install**
```bash
npm run clean
```

## 📱 Accessing the App

- **Local**: http://localhost:5173
- **Network**: http://192.168.x.x:5173 (for mobile testing)
- **Port**: 5173 (default)

## ⚡ Features Enabled

- ✅ **Auto-reload**: Server automatically reloads on any file change
- ✅ **Hot Module Replacement (HMR)**: Instant updates without full refresh
- ✅ **Error Overlay**: Shows compilation errors directly in browser
- ✅ **Network Access**: Access from mobile devices on same network
- ✅ **File Watching**: Monitors all source files for changes
- ✅ **Source Maps**: Easy debugging with source file references

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev-auto` | Install dependencies + start server |
| `npm run dev` | Start development server |
| `npm run dev-watch` | Start with enhanced file watching |
| `npm run build` | Build for production |
| `npm run clean` | Clean install (remove node_modules) |

## 🔄 Auto-Reload Behavior

The server automatically detects changes in:
- All `.ts`, `.tsx` files
- All `.js`, `.jsx` files  
- All `.css`, `.scss` files
- All files in `src/` directory

**Response time**: ~100ms for file changes
**Browser updates**: Instant via HMR when possible

## 📱 Mobile Testing

1. Connect your mobile device to the same WiFi network
2. Find your computer's IP address (run `ipconfig` on Windows)
3. Access: `http://YOUR_IP:5173`
4. The app will auto-reload on both desktop and mobile

## 🔧 Troubleshooting

**Port already in use?**
```bash
# Kill process on port 5173
npx kill-port 5173
# Or use different port
npm run dev -- --port 3000
```

**Dependencies issues?**
```bash
npm run clean
```

**Auto-reload not working?**
- Check that files are saved
- Verify no syntax errors in code
- Try refreshing browser manually once