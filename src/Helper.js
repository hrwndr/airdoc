function escapeHTML(text) {
    var replacements = { "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;" };
    return text.replace(/[<>&"]/g, function (character) {
        return replacements[character];
    });
}

export const convertDataToHtml = blocks => {
    let convertedHtml = `<html><head><link rel="stylesheet" href="https://bootswatch.com/5/zephyr/bootstrap.min.css"></head><style>@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');*{font-family: 'Poppins', Verdana, sans-serif;}</style><body>`;
    blocks.map(block => {

        switch (block.type) {
            case "header":
                convertedHtml += `<h${block.data.level}>${block.data.text}</h${block.data.level}>`;
                break;
            case "embded":
                convertedHtml += `<div><iframe width="560" height="315" src="${block.data.embed}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe></div><br/>`;
                break;
            case "paragraph":
                convertedHtml += `<p>${block.data.text}</p>`;
                break;
            case "delimiter":
                convertedHtml += "<hr />";
                break;
            case "image":
                convertedHtml += `<img src="${block.data.file.url}" title="${block.data.caption}" width="${block.data.stretched == false ? '50%' : '90%'}" /><br /><em>${block.data.caption}</em><br/>`;
                break;
            case "list":
                if (block.data.style === "ordered") {
                    convertedHtml += '<ol>';
                    block.data.items.forEach(function (li) {
                        convertedHtml += ` <li>${li}</li>`;
                    });
                    convertedHtml += "</ol><br/>";
                } else {
                    convertedHtml += '<ul type="circle">';
                    block.data.items.forEach(function (li) {
                        convertedHtml += ` <li>${li}</li>`;
                    });
                    convertedHtml += "</ul><br/>";
                }
                break;
            case "checklist":
                block.data.items.forEach(function (item) {
                    if (JSON.parse(item.checked)) {
                        convertedHtml += `<div class="form-check">
                        <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked>
                        <label class="form-check-label" for="flexCheckDefault">
                        ${item.text}
                        </label>
                        </div>`;
                    } else {
                        convertedHtml += `<div class="form-check">
                    <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault">
                    <label class="form-check-label" for="flexCheckDefault" >
                      ${item.text}
                    </label>
                  </div>`;
                    }
                });
                convertedHtml += "<br/>";
                break;
            case "table":
                convertedHtml += '<table class="table table-hover">';
                block.data.content.forEach(function (tr) {
                    convertedHtml += `<tr>`;
                    tr.forEach(function (td) {
                        convertedHtml += `<td>${td}</td>`;
                    });
                    convertedHtml += `</tr>`;
                });
                convertedHtml += "</table><br/>";
                break;
            case "warning":
                convertedHtml += `<div class="alert alert-dismissible alert-warning">
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                <h4 class="alert-heading">Warning!</h4>
                <p class="mb-0">${block.data.title}</a></p>
              </div><br/>`;
                break;
            case "code":
                convertedHtml += `<pre>${escapeHTML(block.data.code)}</pre><br/>`;
                break;
            case "raw":
                convertedHtml += `<pre>${block.data.html}</pre><br/>`;
                break;
            case "linkTool":
                convertedHtml += `<a href="${block.data.link}">${block.data.link}</a><br/>`;
                break;
            case "quote":
                convertedHtml += `<blockquote class="blockquote">
                <p class="mb-0">${block.data.text}</p>
              </blockquote><br/>`;
                break;
            default:
                console.log("Unknown block type", block.type);
                break;
        }
    });
    convertedHtml += `</div></body></html>`;
    return convertedHtml;
}