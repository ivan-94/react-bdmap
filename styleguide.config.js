const path = require('path')
const pkg = require('./package.json')

module.exports = {
  title: `react-bdmap v${pkg.version}`,
  sections: [
    {
      name: 'Getting Started',
      content: 'README.md',
    },
    {
      name: 'Container',
      components: ['src/BDMapLoader.tsx', 'src/BDMap.tsx'],
      sectionDepth: 1,
    },
    {
      name: 'Controls',
      components: 'src/controls/[A-Z]*.tsx',
      sectionDepth: 1,
    },
    {
      name: 'Overlays',
      components: 'src/overlays/[A-Z]*.tsx',
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
  // Typescript支持
  resolver: require('react-docgen').resolver.findAllComponentDefinitions,
  propsParser: require('react-docgen-typescript').withCustomConfig('./tsconfig.json', []).parse,
  webpackConfig: {
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: [
            {
              loader: require.resolve('ts-loader'),
              options: {
                transpileOnly: true,
              },
            },
          ],
        },
      ],
    },
  },
}
