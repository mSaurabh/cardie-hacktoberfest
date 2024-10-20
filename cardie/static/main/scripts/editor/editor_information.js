var text_items = new Array();
var link_items = new Array();
var currently_editing_icon;
var items_list;

function editor_create_json() {
    let card_json = {
        "uuid": "unknown",
        "name": "",
        "author": "unknown",
        "layout": "left",
        "details": {
            "primary": "",
            "secondary": ""
        },
        "information": {
            "items": []
        },
        "colors": {
            "background": "#ffffff", 
            "accent": "#000000", 
            "text": "#000000"
        },
        "font_style": "Simple",
        "version": 4
    }

    card_json["name"] = document.querySelector("#editor_header_name_text_cardname").innerText;
    card_json["author"] = username;
    card_json["layout"] = layout;
    card_json["details"]["primary"] = document.querySelector("#editor_main_settings_details_primary").value;
    card_json["details"]["secondary"] = document.querySelector("#editor_main_settings_details_secondary").value;

    card_json["colors"]["background"] = document.querySelector("#editor_main_settings_colors_background").value;
    card_json["colors"]["accent"] = document.querySelector("#editor_main_settings_colors_accent").value;
    card_json["colors"]["text"] = document.querySelector("#editor_main_settings_colors_text").value;
    card_json["font_style"] = font_style;

    for (const item in items_list) {
        let item_uuid = items_list[item].id;
        let item_icon = items_list[item].icon;
        let item_text = items_list[item].text;
        let item_url = items_list[item].url;
        let item_url_enabled = items_list[item].url_enabled;
        let item_position = items_list[item].position;

        let item_json = {
            "uuid": item_uuid,
            "icon": item_icon,
            "text": item_text,
            "url": item_url,
            "url_enabled": item_url_enabled,
            "position": item_position
        }

        card_json["information"]["items"].push(item_json);

        card_json["information"]["items"].sort((a, b) => a.position - b.position)
    }

    return card_json;
}

function editor_load_from_json(json) {
    // Sets up all the buttons based on the json

    json = JSON.parse(json);

    document.querySelector("#editor_header_name_text_cardname").innerText = json["name"];
    document.querySelector("#editor_main_settings_details_primary").value = json["details"]["primary"];
    document.querySelector("#editor_main_settings_details_secondary").value = json["details"]["secondary"];

    document.querySelector("#editor_main_settings_colors_background").value = json["colors"]["background"];
    document.querySelector("#editor_main_settings_colors_accent").value = json["colors"]["accent"];
    document.querySelector("#editor_main_settings_colors_text").value = json["colors"]["text"];
    font_style = json["font_style"];

    card_set_font(".card_card", font_style);
    window.dispatchEvent(new CustomEvent('sendLoadedFontFromJson', {
        detail: { font_style }
    }));

    card_set_layout(".card_card", json["layout"]);
    layout = json["layout"];

    json["information"]["items"].sort((a, b) => a.position - b.position)

    for (const item in json["information"]["items"]) {
        let uuid = json["information"]["items"][item]["uuid"];
        let text = json["information"]["items"][item]["text"];
        let icon = json["information"]["items"][item]["icon"];
        let url = json["information"]["items"][item]["url"];
        let url_enabled = json["information"]["items"][item]["url_enabled"];
        let position = json["information"]["items"][item]["position"];

        window.dispatchEvent(new CustomEvent('createItem', {
            detail: { uuid, text, icon, url, url_enabled, position }
        }));
    }
}

function status_saved() {
    document.querySelector("#editor_status").innerHTML = '<i class="ph-bold ph-check-circle"></i> Saved';
    document.querySelector("#editor_status").style.backgroundColor = 'var(--default-glass-background)';
}

function status_saving() {
    document.querySelector("#editor_status").innerHTML = '<i class="ph-bold ph-spinner-gap"></i> Saving...';
}

function status_unsaved() {
    document.querySelector("#editor_status").innerHTML = '<i class="ph-bold ph-warning-circle"></i> Unsaved Changes';
    document.querySelector("#editor_status").style.backgroundColor = 'rgba(255, 132, 52, 0.4)';
}

function status_error() {
    document.querySelector("#editor_status").innerHTML = '<i class="ph-bold ph-warning"></i> Error';

}

window.addEventListener('itemData', (event) => {
    const { items } = event.detail;
    items_list = items;
});