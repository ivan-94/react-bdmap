const path = require('path')
const pkg = require('./package.json')
const { theme, styles } = require('./styleguide.style')

module.exports = {
  title: `REACT-BDMAP`,
  sections: [
    {
      name: '快速开始',
      content: 'README.md',
    },
    {
      name: '容器',
      components: ['src/BDMapLoader.tsx', 'src/BDMap.tsx'],
      sectionDepth: 1,
    },
    {
      name: '控件',
      components: 'src/controls/[A-Z]*.tsx',
      sections: [
        {
          name: '版权控件',
          components: ['src/controls/CopyrightControl/*.tsx'],
        },
      ],
      sectionDepth: 1,
    },
    {
      name: '覆盖物',
      components: 'src/overlays/[A-Z]*.tsx',
      sectionDepth: 1,
    },
    {
      name: '地图图层',
      components: [
        'src/tileLayers/TileLayer.tsx',
        'src/tileLayers/TrafficLayer.tsx',
        'src/tileLayers/CustomTileLayer.tsx',
        'src/tileLayers/CustomLayer.tsx',
      ],
      sectionDepth: 0,
    },
    {
      name: '其他',
      sections: [
        {
          name: 'withMap',
          content: 'docs/withMap.md',
        },
        {
          name: '右键菜单',
          components: ['src/ContextMenu/*.tsx'],
        },
      ],
      sectionDepth: 1,
    },
  ],
  // 每一节一页, 避免加载多个地图实例
  pagePerSection: true,
  ribbon: {
    url: 'https://github.com/carney520/react-bdmap',
    text: 'Star me on GitHub',
  },
  // 配置导出路径
  getComponentPathLine(cppath) {
    const srcDir = path.resolve('src')
    const dirname = path
      .dirname(path.relative(srcDir, cppath))
      .split(path.sep)
      .join('/')
    const name = path.basename(cppath, '.tsx')

    return `import ${name} from '${path.posix.join(pkg.name, dirname, name)}'`
  },
  // 配置对应的example 文档
  getExampleFilename(cppath) {
    const baseDir = path.resolve('docs')
    const srcDir = path.resolve('src')
    const relative = path.relative(srcDir, cppath)
    return path.join(baseDir, relative).replace(/\.tsx?$/, '.md')
  },
  editorConfig: {
    theme: 'monokai',
  },
  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.4.1/semantic.min.css',
        },
      ],
    },
  },
  theme: theme,
  styles: styles,
  exampleMode: 'expand',
  usageMode: 'expand',
  require: [path.resolve(__dirname, 'docs/helpers/setup.tsx')],
  // Typescript支持
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  propsParser: require('react-docgen-typescript').withCustomConfig('./tsconfig.json', []).parse,
  styleguideComponents: {
    LogoRenderer: path.join(__dirname, 'rsg-components/Logo'),
    ReactComponentRenderer: path.join(__dirname, 'rsg-components/ReactComponent'),
  },
  webpackConfig: {
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {
          oneOf: [
            {
              test: /\.(js|mjs|jsx|ts|tsx)$/,
              exclude: /node_modules/,
              loader: require.resolve('babel-loader'),
              options: {
                babelrc: false,
                configFile: false,
                presets: [require.resolve('babel-preset-react-app')],
                cacheDirectory: true,
              },
            },
            {
              loader: require.resolve('file-loader'),
              // Exclude `js` files to keep "css" loader working as it injects
              // its runtime that would otherwise be processed through "file" loader.
              // Also exclude `html` and `json` extensions so they get processed
              // by webpacks internal loaders.
              exclude: [/\.(js|mjs|jsx|ts|tsx)$/, /\.html$/, /\.json$/],
              options: {
                name: 'static/media/[name].[hash:8].[ext]',
              },
            },
          ],
        },
      ],
    },
  },
}
