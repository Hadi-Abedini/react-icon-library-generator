# React Icon Generator CLI

React Icon Generator CLI is a lightweight, high-performance tool that automates the conversion of SVG and PNG assets into fully typed, tree-shakable React components.

Stop manually converting SVGs. Point this CLI to your assets folder, and get a production-ready icon library in seconds.

## 🚀 Key Features

- ⚡️ **Instant Conversion:** Transforms .svg and .png files into optimized React components.
- 📦 **Smart Caching:** Only rebuilds changed files to keep your build process fast.
- 🎨 **Visual Preview:** Generates a `preview.html` to easily browse your icon set.
- 📘 **TypeScript Support:** Includes built-in type definitions (`.d.ts`) and fully typed props.
- 🧩 **Zero Configuration:** Works out-of-the-box with sensible defaults (Prettier included).
- 🗂 **Structured Output:** Creates an `iconPack` with an index barrel file and a dynamic map.

## 📦 Installation

### Method 1: Run via npx (Recommended)
```bash
npx react-icon-generator-cli ./path/to/icons
```

### Method 2: Install as Dev Dependency
```bash
# npm
npm install --save-dev react-icon-generator-cli

# yarn
yarn add --dev react-icon-generator-cli

# bun
bun add -d react-icon-generator-cli
```

Add a script to your `package.json`:
```json
"scripts": {
  "generate:icons": "react-icon-generator-cli ./assets/svgs"
}
```

## 🛠 Usage

1. **Organize your assets**

Place your icon files in a directory. Recommended: `kebab-case` or `PascalCase`.

```
/assets/icons
├── user-profile.svg
├── settings.svg
└── notification-bell.png
```

2. **Run the command**
```bash
npx react-icon-generator-cli ./assets/icons
```

3. **Generated Structure**

```
iconPack/
├── icons/               # ⚛️ Individual React Components
│   ├── IconUserProfile.tsx
│   ├── IconSettings.tsx
│   └── IconNotificationBell.tsx
├── index.ts             # 📤 Barrel file for named exports
├── iconMap.ts           # 🗺 Object mapping keys to components
└── preview.html         # 👁 Open in browser to view icons
```

## 💻 Implementation in React

**Direct Import (Recommended)**
```ts
import { IconUserProfile, IconSettings } from './iconPack';

const NavBar = () => {
  return (
    <nav>
      <IconUserProfile width={24} height={24} className="text-blue-500" />
      <IconSettings style={{ color: 'red' }} />
    </nav>
  );
};
```

**Dynamic Import (Using IconMap)**
```ts
import { iconMap } from './iconPack/iconMap';

type IconName = keyof typeof iconMap;

const MenuItem = ({ iconName }: { iconName: IconName }) => {
  const Icon = iconMap[iconName];
  if (!Icon) return null;
  return (
    <div className="menu-item">
      <Icon width="20" height="20" />
    </div>
  );
};
```

## ⚙️ Requirements

- Node.js: v18.0.0 or higher
- Works best with React + TypeScript projects (Next.js, Vite, CRA).

## 🤝 Contributing

1. Fork the project  
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)  
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)  
4. Push to the branch (`git push origin feature/AmazingFeature`)  
5. Open a Pull Request  

## 📄 License

Distributed under the MIT License. See LICENSE for more information.
