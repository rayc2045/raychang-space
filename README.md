# Ray Chang Space - CMS Portfolio Site with Smooth-scrolling

![Photo](https://cdn.dribbble.com/users/3800131/screenshots/14628965/media/43ed0e7cda60ecdd5885fdd578b9f1d5.png)

[> Ray Chang Space](https://rayc.dev)

### 簡介
我始終認為，設計與開發是一體兩面，設計本是為開發而存在，開發也是為了完成設計，兩者相輔相成、互相影響。因此在網站的主頁中，我使用建築圖與對設計和開發的解釋，來表現自己在前端學習上，執著於兼顧清晰的設計與流暢的開發；網站設計上，我以報紙風格做為基礎，加入噪點以實現擬似紙張的質感，並刻意封鎖毫不必要的使用者事件（如文字選取、圖片拖移、右鍵點擊）、使用更有記憶性的鼠標圖案、加入平滑滾動與滾動視差，以及開發出鼠標觸碰作品圖的漸變效果和連絡表單輸入錯誤的微互動。

### 外觀與互動設計
- 使用非純白 `#F9F9F9` 網頁底色，以及使用 `data:image` [噪點](http://noisepng.com/) 填充頁面，增添紙張印刷的質感
- 網站首頁以報紙風格為基礎，搭配聖保羅教堂和建築兩旁對設計與開發的個人見解，加上點擊連結時的翻頁音效，進一步增添如同閱讀報刊的體驗<!-- - 將長度 2 分 54 秒的音樂 [Touch - Svyat Illin](https://icons8.com/music/search/touch) 剪輯為 31 秒在背景無限循環播放 -->
- 封鎖任何破壞瀏覽體驗的使用者操作，如文字選取、圖片拖移和右鍵點擊；作為替代，在首頁的其他頁面加上了自製的右鍵選單，達到更簡潔的視覺版面與更精緻的使用體驗；以及在任何頁面、任何地方點擊時，加入彷彿輕點水面的漣漪效果
- 導入平滑滾動與滾動視差功能，實現在非觸控設備上享受滑順捲動體驗之餘，感受網頁元素之間互相交錯的動態立體感
- 為首頁作品區塊加上三層互動效果：(1) 捲動頁面時，將畫面中間的作品封面加上灰階轉彩色的漸變效果；(2) 鼠標碰觸作品封面時 (非觸控設備)，將作品封面暗化的效果；(3) 結合以上兩者，當鼠標碰觸畫面中間以外的作品時 (非觸控設備)，碰觸的作品封面轉為彩色加上暗化，並將畫面中間的作品封面轉為灰階，呈現焦點切換的互動
- 首頁底部連絡表單的設計上，加入填寫表單時的打字音效和送出表單、進行驗證卻格式不如預期時，加入頗有趣味的提示動畫，使無聊的表單填寫變得有聲有色；另外，在 Message 區塊中，達到讓 `Textarea` 能隨著文字量做擴展或內縮的自適應，以及實現在表單提交、捲動頁面離開感謝視窗後，自動換回連絡表單的復原設計
- [About 頁面](https://rayc.dev/about) 設計上，以全大寫英文配上中文的標題呈現方正、整齊的風格；履歷以帶有紋路的象牙紙為底，使用深灰而非純黑字提升閱讀上的體驗
- [404 Not Found 頁面](https://rayc.dev/404) 設計上，使用 [Kit8 付費插畫](https://kit8.net/illustrations/web-online-page-with-404-not-found-error/) 後製陰影並搭配 [Nunito 字體](https://fonts.google.com/specimen/Nunito?preview.text_type=custom/) 和噪點填充背景，取代原先伺服器預設的 404 頁面

### 開發紀錄
- 購買並使用 [Google Domains](https://domains.google.com/) 網域名稱：rayc.dev
- 使用 CSS 預處理器 Sass 模組化開發與封裝樣式；使用 Vanilla JavaScript 開發網站功能
- 網頁元素以 `rem` 做單位，達成在任何尺寸的設備上，顯示一致絕佳比例的頁面佈局
- 使用 `@font-face` + `font-display: swap` 方式加載自託管 (self-hosted) 字體，減少網頁請求數、加快字體載入速度
- 大型圖片、影片資源採用 [WebP](https://developers.google.com/speed/webp)/[WebM](https://web.dev/efficient-animated-content/) 格式呈現，檔案大小減少 82%！並使用 [Lazy loading](https://web.dev/browser-level-image-lazy-loading/) 延遲載入技術，進一步提升網頁載入速度達 2.85 倍
- 使用雙層 `setTimeout` 定時器配上秒數校準計算，達成精準的整點 (00:00:00) 日期更新
- 使用 [Locomotive Scroll](https://locomotivemtl.github.io/locomotive-scroll/) 套件達成平滑滾動，讓使用滑鼠捲動網頁時，就像滑手機一樣順；以及使用 [GSAP](https://greensock.com/gsap/) 和 [ScrollTrigger](https://greensock.com/scrolltrigger/) 套件對複數元素做滾動視差，實現網站的立體感<!-- - 使用 [Rellax](https://dixonandmoe.com/rellax/) 做滾動視差 -->
- 為展示的作品封面加上鼠標碰觸和捲動頁面時，讓到達畫面中間的作品呈現灰階轉彩色的互動效果 ([ScrollTrigger Toggle Class](https://greensock.com/docs/v3/Plugins/ScrollTrigger)) ，再透過監聽事件結合兩者，使其能夠和諧地發揮功能
- 針對使用者設備做互動效果優化，使用非觸控設備開啟網頁才會加入滑鼠碰觸元素的互動效果，如首頁作品封面的灰階轉彩色效果，以及在 About 頁面中，鼠標碰觸超連結時顯示的底線
- 善用 JavaScript `Async/Await` 語法排程管理同步與非同步程式碼，使抓取資料、頁面渲染完畢到 Loading 動畫結束的過程始終穩定流暢
- About 和 Projects 頁面使用 Markdown CMS 內容管理作法，透過連動 Markdown 格式檔案，再搭配 [markdown-it](https://github.com/markdown-it/markdown-it#markdown-it-) 套件渲染頁面，以及使用 [highlight.js](https://github.com/highlightjs/highlight.js/#highlightjs) 套件對程式碼做高亮效果 (Syntax highlighting)，大大減少日後內容更新的成本