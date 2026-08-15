document.addEventListener('DOMContentLoaded', () => {
    
    const pageContent = document.body.innerHTML; //html body content 

    //Define the HTML Switch layout 
    const switchLayout = `
        <div class="switch-container">
            <!-- Left Screen Area (4/5) -->
            <div class="screen-area">
                <div class="screen-content" id="screenContent">
                    ${pageContent} //BODY CONTENT
                </div>
            </div>

            <!-- Right Controller Area (1/5) -->
            <div class="controller-area">
                <!-- Button Group (YABX) -->
                <div class="diamond-group">
                    <button class="btn btn-y">Y</button>
                    <button class="btn btn-x">X</button>
                    <button class="btn btn-b">B</button>
                    <button class="btn btn-a">A</button>
                </div>

                <!-- OK Button -->
                <button class="btn-ok">OK</button>

                <!-- 🔥 新增：回到頂端按鈕 -->
                <button class="btn-top" id="btnTop">Top</button>

            </div>
        </div>
    `;

    // Inject the layout into body
    document.body.innerHTML = switchLayout;
});