# 🪟 Building RetroWire as a Windows Standalone Application

## ✅ Setup Complete!

Your project is now configured to build as a standalone Windows application using Electron.

## 📦 What's Been Configured

### Electron Setup
- ✅ Electron installed (v39.2.3)
- ✅ Electron-builder installed for packaging
- ✅ Main process created (`electron/main.js`)
- ✅ RetroWire logo copied to `public/icon.png`
- ✅ Package.json configured with build scripts

### Build Configuration
- **App Name**: RetroWire
- **Version**: 1.0.0
- **Output**: `release/` folder
- **Installer**: NSIS (Windows installer)
- **Icon**: Retro TV logo with orange accents

## 🚀 How to Build

### Option 1: Development Mode (Test the Electron App)
```bash
npm run electron:dev
```

This will:
- Start Vite dev server (port 5176)
- Launch Electron window
- Enable hot-reload for development
- Open DevTools for debugging

### Option 2: Build Windows Installer
```bash
npm run electron:build:win
```

This will:
1. Compile TypeScript
2. Build optimized production bundle
3. Package with Electron
4. Create Windows installer (~150-200MB)
5. Output to `release/` folder

## 📁 After Building

You'll find in the `release/` folder:

```
release/
├── RetroWire Setup 1.0.0.exe        (NSIS installer)
├── win-unpacked/                     (Portable version)
│   └── RetroWire.exe
└── builder-effective-config.yaml    (Build configuration)
```

## 💾 Installer Features

The NSIS installer will:
- ✅ Install to `C:\Users\<username>\AppData\Local\Programs\RetroWire`
- ✅ Create desktop shortcut
- ✅ Create Start Menu entry
- ✅ Add to Windows Apps & Features (for uninstall)
- ✅ Allow custom installation directory

## 🎯 Distribution

After building, you can distribute:

1. **RetroWire Setup 1.0.0.exe** - Full installer
   - Users run this to install the app
   - Handles updates and uninstall

2. **win-unpacked folder** - Portable version
   - No installation needed
   - Run RetroWire.exe directly
   - Good for USB drives or testing

## 🔧 Build Output Size

Expected sizes:
- **Installer**: ~150-200 MB (includes Electron runtime)
- **Installed App**: ~180-220 MB
- **Portable (unpacked)**: ~200-250 MB

## 🐛 Troubleshooting

### Build Fails
```bash
# Clean and rebuild
rm -rf dist release node_modules
npm install
npm run electron:build:win
```

### App Won't Start
- Check Windows Defender/Antivirus (may block unsigned apps)
- Right-click installer → Properties → Unblock

### Development Mode Issues
```bash
# Make sure ports are free
netstat -ano | findstr :5176
# Kill process if needed, then restart
npm run electron:dev
```

## 🎨 Customizing the Icon

The app already uses your RetroWire logo! If you want to create a proper Windows .ico file:

### Option A: Online Converter
1. Visit https://convertio.co/png-ico/
2. Upload `public/icon.png`
3. Convert to .ico (256x256)
4. Save as `public/icon.ico`
5. Update `package.json` build.win.icon to `"public/icon.ico"`

### Option B: Using ImageMagick (if installed)
```bash
magick convert public/icon.png -define icon:auto-resize=256,128,64,48,32,16 public/icon.ico
```

## 🚀 Next Steps

### 1. Test Development Mode
```bash
npm run electron:dev
```

### 2. Build Installer
```bash
npm run electron:build:win
```

### 3. Test Installation
- Find `release/RetroWire Setup 1.0.0.exe`
- Run installer
- Test the installed app

### 4. Distribute
- Share the installer with users
- Or share the portable version from `release/win-unpacked/`

## 📝 Notes

- **First build takes longer** (~5-10 minutes) as Electron downloads binaries
- **Subsequent builds are faster** (~1-2 minutes)
- **App is unsigned** - users may see security warnings (normal for free apps)
- **To sign the app** - requires a code signing certificate ($$$)

## 🎉 You're Ready!

Your RetroWire app is configured and ready to build as a standalone Windows application!

Run `npm run electron:build:win` when ready to create the installer.
