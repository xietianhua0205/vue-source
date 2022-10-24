import serve from 'rollup-plugin-serve'
import babel from 'rollup-plugin-babel'

export default {
    input: './src/index.js', // 打包入口文件
    output: {
        file: 'dist/vue.js', // 打包出口文件
        format: 'umd', // 在window上 Vue
        name: 'Vue',
        sourcemap: true
    },
    plugins:[babel({
        exclude: 'node_modules/**'
    }),
        serve({
            port: 3000,
            contentBase:'',// 表示当前目录
            openPage:'/index.html'
        })
    ]
}

