# Ray Chang Space - CMS Portfolio Site with Smooth-scrolling

[![Photo](https://cdn.dribbble.com/users/3800131/screenshots/14628965/media/43ed0e7cda60ecdd5885fdd578b9f1d5.png)](https://dribbble.com/raychangdesign)

[> Ray Chang Space](https://rayc.dev)

### 簡介
我始終認為，設計與開發是一體兩面，設計本是為開發而存在，開發也是為了完成設計，兩者相輔相成、互相影響。因此在網站的主頁中，我使用建築圖與對設計和開發的解釋，來表現自己在前端學習上，執著於兼顧清晰的設計與流暢的開發；網站設計上，我以報紙風格做為基礎，加入噪點以實現擬似紙張的質感，並刻意封鎖毫不必要的使用者事件（如文字選取、圖片拖移、右鍵點擊）、使用更有記憶性的鼠標圖案、加入平滑滾動與滾動視差，以及開發出鼠標觸碰作品圖的漸變效果和連絡表單輸入錯誤的微互動。

### 外觀與互動設計
- 使用非純白 (#F9F9F9) 作為網頁底色，持久觀看不炫光
- 網站主頁以報紙風格為基礎，並搭配聖保羅教堂點出自己對設計與開發的想法，再以自製格式輸出當前時間到網頁主畫面，以及使用 `data:image` [噪點](http://noisepng.com/) 填充頁面，增添紙張印刷的質感
- 導入平滑滾動與滾動視差功能，實現立體感網站
- 封鎖任何破壞瀏覽體驗的使用者操作事件，如文字選取、圖片拖移和右鍵點擊，並加入點擊頁面時的互動效果作為補償<!-- - 將長度為 2:54 的音樂 [Touch - Svyat Illin](https://icons8.com/music/search/touch) 剪輯為 31 秒在背景無限循環播放；另外在點擊連結、填寫連絡表單時分別加入翻頁和打字音效，讓網站變得有聲有色 -->
- 加入表單驗證功能，並在驗證結果為不通過時加入提示動畫，減少輸入錯誤的挫折感，並設計讓 Textarea 達到能隨著文字量做擴展或內縮的自適應；以及在表單提交、捲動頁面離開感謝視窗後，自動換回連絡表單的復原設計
- About 頁面中使用自製右鍵選單，解決導覽列 (Navbar) 佔版面、鼠標移動距離較長 (費茲定律) 的問題，達到更簡潔的視覺版面與更加順暢的使用體驗
- [履歷](https://rayc.dev/about/resume/rayc_resume.pdf#toolbar=0&navpanes=0&scrollbar=0&zoom=125) 設計上，以全大寫英文配上中文的標題呈現方正、整齊的風格，並使用帶有紋路的象牙紙為底，以及深灰而非純黑字提升閱讀上的質感
- 使用 [Kit8 付費插畫](https://kit8.net/illustrations/web-online-page-with-404-not-found-error/) 後製陰影並搭配 [Nunito 字體](https://fonts.google.com/specimen/Nunito?preview.text_type=custom) 和噪點背景，客製化重定向 [404 Not Found 頁面](https://rayc.dev/whatever)
- 使用自訂網域名稱 [rayc.dev](https://rayc.dev)

### 開發紀錄
- 使用預處理器 Sass 模組化開發與管理 CSS
- 使用 JavaScript `class` 物件導向式開發網站功能
- 網頁元素以 `rem` 做單位，達成在任何尺寸的設備上，顯示一致的絕佳比例<!-- - 使用 CSS `@media` 和 `transform` 讓使用者設備為手機時，自動旋轉 90 度以提供最佳瀏覽體驗 -->
- 使用 `@font-face` + `font-display: swap` 方式加載自託管 (self-hosted) 字體，減少網頁請求數、加快字體載入速度
- 大型圖片、影片資源採用 [WebP](https://developers.google.com/speed/webp)/[WebM](https://web.dev/efficient-animated-content/) 格式呈現，檔案大小減少 82%！並使用 [Lazy loading](https://web.dev/browser-level-image-lazy-loading/) 延遲載入技術，網頁載入效率提升 2.85 倍
- 使用雙層 `setTimeout` 定時器配上秒數校準，達成精準的整點 (00:00:00) 日期更新
- 透過切換 Body 的 CSS 屬性 `overflow: hidden`，簡單達成網頁載入完成前的封鎖捲動
- 加入 [Locomotive Scroll](https://locomotivemtl.github.io/locomotive-scroll/) 平滑滾動功能，使用滑鼠捲動網頁就像滑手機一樣順；以及使用 [GSAP](https://greensock.com/gsap/) 達成滾動視差，再透過過 [ScrollTrigger](https://greensock.com/scrolltrigger/) 綁定平滑滾動與滾動視差功能<!-- - 使用 [Rellax](https://dixonandmoe.com/rellax/) 做滾動視差 -->
- 為展示的作品封面加上鼠標碰觸 (CSS Hover) 和捲動頁面 ([ScrollTrigger Toggle Class](https://greensock.com/docs/v3/Plugins/ScrollTrigger)) 時的灰階上色互動效果，再透過監聽事件結合兩者，使其能夠和諧地發揮功能
- 針對使用者設備做互動效果優化，使用非觸控設備開啟網頁才會加入滑鼠碰觸元素的互動效果，如首頁作品圖片的灰階上色效果，以及 About 頁面中顯示的超連結底線
- 作品介紹頁面使用 `fetch` 抓取存放在 Github 上的 markdown 檔案文字，再透過 [markdown-it](https://github.com/markdown-it/markdown-it) 將段落解析為 html 渲染頁面，順便減少日後內容更新的成本