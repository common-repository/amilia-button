(function() {

  var PLUGIN_NAME = "amilia_button",
      COLORS = {g: '#40d892', dg: '#28b172', b: '#46aaf8', db: '#158ae5', o: '#fba16b', r: '#fb5b5b', y: '#fce162', steel: '#8294ab'},
      IMAGES = ["check", "edit", "lock"],
      dictionnary = typeof tinymce.i18n.data == "object" ? tinymce.i18n.data : tinymce.i18n;

  tinyMCE.addI18n(window.objectL10n.lang + "." + PLUGIN_NAME, window.objectL10n);

  var modalTemplate = [
    '<h3>{modal-title}</h3>',
    '<div>',
    '  <label>{url-label} <a class="amilia-help1" href="#">(?)</a></label>',
    '  <input type="text" name="store-url" />',
    '</div>',
    '<div>',
    '  <div class="amilia-left">',
    '    <div>',
    '      <label>{color}</label>',
    '      <select name="color">',
    '        <option value="g">{g}</option>',
    '        <option value="dg">{dg}</option>',
    '        <option selected="selected" value="b">{b}</option>',
    '        <option value="db">{db}</option>',
    '        <option value="o">{o}</option>',
    '        <option value="r">{r}</option>',
    '        <option value="y">{y}</option>',
    '        <option value="steel">{steel}</option>',
    '      </select>',
    '    </div>',
    '    <div>',
    '      <label>{image}</label>',
    '      <select name="image">',
    '        <option selected="selected" value="check">{check}</option>',
    '        <option value="edit">{edit}</option>',
    '        <option value="lock">{lock}</option>',
    '      </select>',
    '    </div>',
    '    <div>',
    '      <label>{text}</label>',
    '      <input type="text" name="text" value="{text-value}" />',
    '    </div>',
    '  </div>',
    '  <div class="amilia-right">',
    '    <div id="amilia-button-preview" class="amilia-button-wrapper" style="width:175px; display:inline-block;"></div>',
    '  </div>',
    '</div>',
    '<div class="amilia-buttons">',
    '  <button name="insert">{insert}</button>',
    '  <button name="update">{update}</button>',
    '  <button name="delete">{delete}</button>',
    '  <button name="cancel">{close}</button>',
    '  <a class="amilia-help2" href="#">{help}</a>',
    '  <div class="clear"></div>',
    '</div>',
    '<div class="amilia-instructions" style="display:none;">',
    '  <h3>{instructions}</h3>',
    '  <p>{instructions-p1}</p>',
    '  <p>{instructions-p2}</p>',
    '  <p>{instructions-p3}</p>',
    '</div>'
  ].join("\n");

  var buttonTemplate = [
    '<a class="amilia-button" href="{url}" style="color:{color}; background:{backgroundColor} url(\'{imageUrl}\') no-repeat 10px 10px; border-radius:2px; font:bold 13px/16px arial; text-indent:0; height:40px; width:175px; text-decoration:none; position:relative; display:table; *display:inline-block;">',
      '<span style="display:block; *position:absolute; *top:50%; display:table-cell; vertical-align:middle; *width:175px;">',
        '<span style="display:block; *position:relative; *top:-50%; padding-left:45px;">',
          '{text}',
        '</span>',
      '</span>',
    '</a>'
  ].join('');

  function lang(key, lang) {
    lang || (lang = tinymce.activeEditor.settings.language);
    if (lang != "fr") lang = "en";
    return dictionnary[lang + '.' + PLUGIN_NAME + '.' + key] || key;
  }

  function localize(template) {
    return template.replace(/{([a-zA-Z0-9-_]+)}/g, function($0, $1) {
        return lang($1);
    });
  }

  function validateUrl(url) {
    return /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(url);
  };

  function validateText(text) {
    return text.replace(/^\s\s*/, '').replace(/\s\s*$/, '').length > 0;
  };

  function getColor(backgroundColor) {
    var hexDigits = new Array ("0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"); 
    function hex(x) {
      return isNaN(x) ? "00" : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];
    }
    backgroundColor || (backgroundColor = "");
    var rgb = backgroundColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    backgroundColor = "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
    for (var key in COLORS)
      if (COLORS.hasOwnProperty(key) && backgroundColor == COLORS[key]) return key;
    return "b";
  }

  function getImage(backgroundImage) {
    backgroundImage || (backgroundImage = "");
    for (var i = 0; i < IMAGES.length; i++)
      if (backgroundImage.indexOf(IMAGES[i]) != -1) return IMAGES[i];
    return IMAGES[0];
  }

  tinymce.PluginManager.add(PLUGIN_NAME, function(editor, url) {
    tinymce.DOM.loadCSS(url + "/amilia-button.css");
    modalTemplate = localize(modalTemplate);


    // The modal
    var mask = document.createElement("div");
    mask.id = "amilia-mask";
    document.body.appendChild(mask);
    mask.style.display = "none";

    var modal = document.createElement("div");
    modal.id = "amilia-modal";
    document.body.appendChild(modal);
    modal.innerHTML = modalTemplate;
    modal.style.display = "none";

    var storeUrl = modal.querySelector("input[name=store-url]"),
        color = modal.querySelector("select[name=color]"),
        image = modal.querySelector("select[name=image]"),
        text = modal.querySelector("input[name=text]"),
        preview = modal.querySelector("#amilia-button-preview"),
        insertButton = modal.querySelector("button[name=insert]"),
        updateButton = modal.querySelector("button[name=update]"),
        deleteButton = modal.querySelector("button[name=delete]"),
        cancelButton = modal.querySelector("button[name=cancel]"),
        help1 = modal.querySelector("a.amilia-help1"),
        help2 = modal.querySelector("a.amilia-help2"),
        instructions = modal.querySelector(".amilia-instructions"),
        activeButton = null;

    function generateRawHtml() {
      return buttonTemplate
        .replace('{url}', storeUrl.value)
        .replace('{color}', COLORS[color.value] == 'y' ? '#494949' : '#ffffff')
        .replace('{backgroundColor}', COLORS[color.value])
        .replace('{imageUrl}', url + "/" + image.value + ".png")
        .replace('{text}', text.value);
    }

    function updatePreview() {
      preview.innerHTML = generateRawHtml(true);
    }

    function validate() {
      if (!validateUrl(storeUrl.value)) {
        alert(lang("error-invalid-url"));
        return false;
      }
      if (!validateText(text.value)) {
        alert(lang("error-invalid-text"));
        return false;
      }
      return true;
    }

    function close(e) {
      mask.style.display = "none";
      modal.style.display = "none";
    }

    color.onchange = image.onchange =  text.onchange = updatePreview;
    insertButton.onclick = function(e) {
      if (!validate()) return;
      editor.execCommand("mceInsertRawHTML", false, generateRawHtml() + "<p></p>");
      close();
    };
    updateButton.onclick = function(e) {
      if (!validate()) return;
      activeButton.innerHTML = "";
      editor.execCommand("mceRemoveNode", false, activeButton);
      editor.execCommand("mceInsertRawHTML", false, generateRawHtml());
      close();
    }
    deleteButton.onclick = function(e) {
      activeButton.innerHTML = "";
      editor.execCommand("mceRemoveNode", false, activeButton);
      close();
    }
    cancelButton.onclick = close;
    mask.onclick = close;
    help1.onclick = help2.onclick = function(e) {
      e.preventDefault();
      instructions.style.display = "block";
      return false;
    }

    function getActiveButton() {
      return editor.dom.getParent(editor.selection.getNode(), "a.amilia-button");
    }

    function showModal() {
      activeButton = getActiveButton();
      if (activeButton) {
        if (activeButton) {
          storeUrl.value = activeButton.href;
          color.value = getColor(activeButton.style.backgroundColor);
          image.value = getImage(activeButton.style.backgroundImage);
          text.value = activeButton.querySelector("span span").textContent;
        }
        insertButton.style.display = "none";
        updateButton.style.display = "inline";
        deleteButton.style.display = "inline";
      } else {
        insertButton.style.display = "inline";
        updateButton.style.display = "none";
        deleteButton.style.display = "none";
      }
      mask.style.display = "block";
      modal.style.display = "block";
      modal.style.left = window.innerWidth/2 - modal.offsetWidth/2 + "px";
      updatePreview();
    }


    // The TineMCE button
    editor.addButton(PLUGIN_NAME, {
      onclick: showModal,
      title: "Amilia Button",
      image: url + "/amilia-button.png"
    });
    editor.onNodeChange.add(function(editor, controllManager, node) {
      controllManager.setActive(PLUGIN_NAME, getActiveButton() != null);
    });

  });
  
})();
