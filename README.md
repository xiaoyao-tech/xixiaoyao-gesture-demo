# 夕小瑶手势互动空间 · 公开演示成品

这个仓库只存放浏览器运行所需的静态发布文件，供 GitHub Pages 托管。

- 体验地址：https://xiaoyao-tech.github.io/xixiaoyao-gesture-demo/
- 项目来源：夕小瑶手势互动空间 v12，由 xiaoyao-tech 制作。本发布仓库不包含私有开发仓库及其历史。
- 运行方式：允许摄像头后，在浏览器本机识别手势；不会将摄像头视频上传到网站服务器。
- 构建方式：Next.js 静态导出，构建时设置 NEXT_PUBLIC_BASE_PATH=/xixiaoyao-gesture-demo。
- 部署方式：GitHub Pages 从 main 分支根目录发布；.nojekyll 用于保留 _next 静态资源。
- 后续更新：重新构建后，将新的发布文件提交到这个仓库。只修改私有开发仓库不会自动更新本站。
- 如果更改发布仓库名或网址路径，需要重新构建，不能仅重命名仓库。
- 若部署到 Netlify 根网址或本地根网址，请使用未设置 NEXT_PUBLIC_BASE_PATH 的构建结果。

本仓库不包含账号密码、环境变量文件、开发依赖或服务器端程序。应用代码许可见 LICENSE-code.txt；MediaPipe 运行库许可见 vendor/mediapipe-LICENSE.txt。夕小瑶角色模型及品牌图像保留相应权利；公开演示不意味着这些资产可自由再分发或商用。
