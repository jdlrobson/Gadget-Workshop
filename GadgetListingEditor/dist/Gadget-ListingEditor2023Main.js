/**
 * Listing Editor v3.18.0
 * @maintainer Jdlrobson
 * Please upstream any changes you make here to https://github.com/jdlrobson/Gadget-Workshop/tree/master/GadgetListingEditor
 * Raise issues at https://github.com/jdlrobson/Gadget-Workshop/issues
 * to avoid losing them in future updates.
 *	Source code: https://github.com/jdlrobson/Gadget-Workshop
 *	Wiki: https://en.wikivoyage.org/wiki/MediaWiki:Gadget-ListingEditor2023Main.js
 *	Original author:
 *	- torty3
 *	Additional contributors:
 *	- Andyrom75
 *	- ARR8
 *	- RolandUnger
 *	- Wrh2
 *	- Jdlrobson
 *	Changelog: https://en.wikivoyage.org/wiki/Wikivoyage:Listing_editor#Changelog

 *	TODO
 *	- Add support for mobile devices.
 *	- wrapContent is breaking the expand/collapse logic on the VFD page.
 *	- populate the input-type select list from LISTING_TEMPLATES
 *	- Allow syncing Wikipedia link back to Wikidata with wbsetsitelink
 *	- Allow hierarchy of preferred sources, rather than just one source, for Wikidata sync
 *		- E.g. get URL with language of work = english before any other language version if exists
 *		- E.g. get fall back to getting coordinate of headquarters if geographic coordinates unavailable. Prioritize getting coordinates of entrance before any other coordinates if all present
 *		- E.g. Can use multiple sources to fetch address
 *		- Figure out how to get this to upload properly
 */
 //<nowiki>
window.__WIKIVOYAGE_LISTING_EDITOR_VERSION__ = '3.18.0'

'use strict';

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var propertyP625$1 = [
	"lat",
	"long"
];
var propertyP856$2 = [
	"url"
];
var propertyP968$1 = [
	"email"
];
var propertyP238$1 = [
	"alt"
];
var propertyP18$2 = [
	"image"
];
var addTitle$4 = "Add New Listing";
var editTitle$4 = "Edit Existing Listing";
var addTitleBeta$2 = "Add New Listing (Beta)";
var editTitleBeta$2 = "Edit Existing Listing (Beta)";
var syncTitle$3 = "Wikidata Sync";
var saving$4 = "Saving...";
var submit$4 = "Submit";
var cancel$4 = "Cancel";
var cancelAll$3 = "Clear all";
var preview$3 = "Preview";
var previewOff$3 = "Preview off";
var refresh$3 = "↺";
var refreshTitle$3 = "Refresh preview";
var selectAll$3 = "Select all";
var selectAlternatives$3 = "Select all values where the alternative is empty.";
var validationEmptyListing$4 = "Please enter either a name or an address";
var validationEmail$4 = "Please ensure the email address is valid";
var validationWikipedia$4 = "Please insert the Wikipedia page title only; not the full URL address";
var validationImage$4 = "Please insert the Commons image title only without any prefix";
var added$4 = "Added listing for ";
var updated$4 = "Updated listing for ";
var removed$4 = "Deleted listing for ";
var helpPage$4 = "//en.wikivoyage.org/wiki/Wikivoyage:Listing_editor";
var enterCaptcha$4 = "Enter CAPTCHA";
var externalLinks$4 = "Your edit includes new external links.";
var licenseText$3 = "By clicking \"Submit\", you agree to the <a class=\"external\" target=\"_blank\" href=\"//wikimediafoundation.org/wiki/Terms_of_use\">Terms of use</a>, and you irrevocably agree to release your contribution under the <a class=\"external\" target=\"_blank\" href=\"//en.wikivoyage.org/wiki/Wikivoyage:Full_text_of_the_Attribution-ShareAlike_3.0_license\">CC-BY-SA 3.0 License</a>. You agree that a hyperlink or URL is sufficient attribution under the Creative Commons license.";
var ajaxInitFailure$3 = "Error: Unable to initialize the listing editor";
var sharedWikipedia$2 = "wikipedia";
var synchronized$3 = "synchronized.";
var submitApiError$3 = "Error: The server returned an error while attempting to save the listing, please try again";
var submitBlacklistError$3 = "Error: A value in the data submitted has been blacklisted, please remove the blacklisted pattern and try again";
var submitUnknownError$3 = "Error: An unknown error has been encountered while attempting to save the listing, please try again";
var submitHttpError$3 = "Error: The server responded with an HTTP error while attempting to save the listing, please try again";
var submitEmptyError$3 = "Error: The server returned an empty response while attempting to save the listing, please try again";
var viewCommonsPage$3 = "view Commons page";
var viewWikidataPage$3 = "view Wikidata record";
var viewWikipediaPage$3 = "view Wikipedia page";
var wikidataSharedMatch$3 = "No differences found between local and Wikidata values";
var wikidataShared$3 = "The following data was found in the shared Wikidata record. Update shared fields using these values?";
var wikidataSharedNotFound$3 = "No shared data found in the Wikidata repository";
var wikidataSyncBlurb$3 = "Selecting a value will change both websites to match (selecting an empty value will delete from both). Selecting neither will change nothing. Please err toward selecting one of the values rather than skipping - there are few cases when we should prefer to have a different value intentionally.<p>You are encouraged to go to the Wikidata item and add references for any data you change.";
var editSummary$3 = "Edit Summary";
var name$3 = "Name";
var alt$2 = "Alt";
var website$3 = "Website";
var address$3 = "Address";
var directions$3 = "Directions";
var phone$3 = "Phone";
var tollfree$3 = "Tollfree";
var fax$3 = "Fax";
var lastUpdated$2 = "Last Updated";
var syncWikidata$3 = "Sync shared fields to/from Wikidata";
var syncWikidataTitle$3 = "This simply gets the values from Wikidata and replaces the local values. Useful for new listings.";
var syncWikidataLabel$3 = "(quick fetch)";
var content$3 = "Content";
var minorTitle$3 = "Check the box if the change to the listing is minor, such as a typo correction";
var minorLabel$3 = "minor change?";
var email$3 = "Email";
var type$3 = "Type";
var latitude$3 = "Latitude";
var longitude$3 = "Longitude";
var findOnMap$3 = "find on map";
var hours$3 = "Hours";
var checkin$2 = "Check-in";
var checkout$2 = "Check-out";
var price$3 = "Price";
var wpWd$3 = "Get ID from Wikipedia article";
var wikidataRemoveTitle$3 = "Delete the Wikidata entry from this listing";
var wikidataRemoveLabel$3 = "remove";
var image$4 = "Image";
var listingTooltip$3 = "Check the box if the business is no longer in operation or if the listing should be deleted for some other reason, and it will be removed from this article";
var listingLabel$3 = "delete this listing?";
var listingUpdatedTooltip$2 = "Check the box if the information in this listing has been verified to be current and accurate, and the last updated date will be changed to the current date";
var listingUpdatedLabel$2 = "mark the listing as up-to-date?";
var natlCurrencyTitle$3 = "";
var intlCurrenciesTitle$3 = "";
var require$$0 = {
	"report-bug": "Report bug",
	"listing-editor-version": "Version $1",
	"coordinates-error": "Coordinates are in an invalid form. Please use decimal degrees.",
	"placeholder-name": "name of place",
	"placeholder-alt": "also known as",
	"placeholder-url": "https://www.example.com",
	"placeholder-address": "address of place",
	"placeholder-directions": "how to get here",
	"placeholder-phone": "+55 555 555 5555",
	"placeholder-tollfree": "+1 800 100 1000",
	"placeholder-fax": "+55 555 555 555",
	"placeholder-email": "info@example.com",
	"placeholder-lastedit": "2020-01-15",
	"placeholder-lat": "11.11111",
	"placeholder-long": "111.11111",
	"placeholder-hours": "9AM-5PM or 09:00-17:00",
	"placeholder-checkin": "check in time",
	"placeholder-checkout": "check out time",
	"placeholder-price": "entry or service price",
	"placeholder-wikidata-label": "wikidata record",
	"placeholder-wikipedia": "wikipedia article",
	"placeholder-image": "image of place",
	"placeholder-content": "description of place",
	"placeholder-summary": "reason listing was changed",
	propertyP625: propertyP625$1,
	propertyP856: propertyP856$2,
	propertyP968: propertyP968$1,
	propertyP238: propertyP238$1,
	propertyP18: propertyP18$2,
	addTitle: addTitle$4,
	editTitle: editTitle$4,
	addTitleBeta: addTitleBeta$2,
	editTitleBeta: editTitleBeta$2,
	syncTitle: syncTitle$3,
	saving: saving$4,
	submit: submit$4,
	cancel: cancel$4,
	cancelAll: cancelAll$3,
	preview: preview$3,
	previewOff: previewOff$3,
	refresh: refresh$3,
	refreshTitle: refreshTitle$3,
	selectAll: selectAll$3,
	selectAlternatives: selectAlternatives$3,
	validationEmptyListing: validationEmptyListing$4,
	validationEmail: validationEmail$4,
	validationWikipedia: validationWikipedia$4,
	validationImage: validationImage$4,
	added: added$4,
	updated: updated$4,
	removed: removed$4,
	helpPage: helpPage$4,
	enterCaptcha: enterCaptcha$4,
	externalLinks: externalLinks$4,
	licenseText: licenseText$3,
	ajaxInitFailure: ajaxInitFailure$3,
	sharedWikipedia: sharedWikipedia$2,
	synchronized: synchronized$3,
	submitApiError: submitApiError$3,
	submitBlacklistError: submitBlacklistError$3,
	submitUnknownError: submitUnknownError$3,
	submitHttpError: submitHttpError$3,
	submitEmptyError: submitEmptyError$3,
	viewCommonsPage: viewCommonsPage$3,
	viewWikidataPage: viewWikidataPage$3,
	viewWikipediaPage: viewWikipediaPage$3,
	wikidataSharedMatch: wikidataSharedMatch$3,
	wikidataShared: wikidataShared$3,
	wikidataSharedNotFound: wikidataSharedNotFound$3,
	wikidataSyncBlurb: wikidataSyncBlurb$3,
	editSummary: editSummary$3,
	name: name$3,
	alt: alt$2,
	website: website$3,
	address: address$3,
	directions: directions$3,
	phone: phone$3,
	tollfree: tollfree$3,
	fax: fax$3,
	lastUpdated: lastUpdated$2,
	syncWikidata: syncWikidata$3,
	syncWikidataTitle: syncWikidataTitle$3,
	syncWikidataLabel: syncWikidataLabel$3,
	content: content$3,
	minorTitle: minorTitle$3,
	minorLabel: minorLabel$3,
	email: email$3,
	type: type$3,
	latitude: latitude$3,
	longitude: longitude$3,
	findOnMap: findOnMap$3,
	hours: hours$3,
	checkin: checkin$2,
	checkout: checkout$2,
	price: price$3,
	wpWd: wpWd$3,
	wikidataRemoveTitle: wikidataRemoveTitle$3,
	wikidataRemoveLabel: wikidataRemoveLabel$3,
	image: image$4,
	listingTooltip: listingTooltip$3,
	listingLabel: listingLabel$3,
	listingUpdatedTooltip: listingUpdatedTooltip$2,
	listingUpdatedLabel: listingUpdatedLabel$2,
	natlCurrencyTitle: natlCurrencyTitle$3,
	intlCurrenciesTitle: intlCurrenciesTitle$3
};

var propertyP625 = [
	"vĩ độ",
	"kinh độ"
];
var propertyP856$1 = [
	"url"
];
var propertyP968 = [
	"email"
];
var propertyP238 = [
	"tên khác"
];
var propertyP18$1 = [
	"hình ảnh"
];
var addTitle$3 = "Thêm địa điểm mới";
var editTitle$3 = "Sửa địa điểm hiện tại";
var addTitleBeta$1 = "Thêm địa điểm mới (Beta)";
var editTitleBeta$1 = "Sửa địa điểm hiện tại (Beta)";
var syncTitle$2 = "Đồng bộ Wikidata";
var saving$3 = "Đang lưu...";
var submit$3 = "Lưu";
var cancel$3 = "Hủy";
var cancelAll$2 = "Xóa tất cả";
var preview$2 = "Xem trước";
var previewOff$2 = "Tắt xem trước";
var refresh$2 = "↺";
var refreshTitle$2 = "Làm mới xem trước";
var selectAll$2 = "Chọn tất cả";
var selectAlternatives$2 = "Chọn tất cả các giá trị mà không có tên thay thế.";
var validationEmptyListing$3 = "Vui lòng nhập tên hoặc địa chỉ";
var validationEmail$3 = "Vui lòng đảm bảo địa chỉ email hợp lệ";
var validationWikipedia$3 = "Vui lòng chỉ nhập tên trang Wikipedia, không phải URL đầy đủ";
var validationImage$3 = "Vui lòng chỉ nhập tiêu đề hình ảnh trên Commons, không có tiền tố";
var added$3 = "Thêm địa điểm ";
var updated$3 = "Cập nhật địa điểm ";
var removed$3 = "Xóa địa điểm ";
var helpPage$3 = "//vi.wikivoyage.org/wiki/Wikivoyage:Trình_soạn_thảo_địa_điểm";
var enterCaptcha$3 = "Nhập CAPTCHA";
var externalLinks$3 = "Sửa đổi của bạn có chứa các liên kết ngoài mới.";
var licenseText$2 = "Nhấp vào “Lưu” có nghĩa là bạn đồng ý với <a class=\"external\" target=\"_blank\" href=\"//foundation.wikimedia.org/wiki/Special:MyLanguage/Terms_of_use\">Điều khoản sử dụng</a>, và bạn đồng ý phát hành, một cách không thể hủy bỏ, các đóng góp của bạn theo <a class=\"external\" target=\"_blank\" href=\"//vi.wikipedia.org/wiki/Wikipedia:Nguyên_văn_Giấy_phép_Creative_Commons_Ghi_công–Chia_sẻ_tương_tự_phiên_bản_4.0_Quốc_tế\">Giấy phép CC-BY-SA 4.0</a>. Bạn đồng ý rằng một siêu liên kết hoặc URL là đủ điều kiện ghi công theo giấy phép Creative Commons.";
var ajaxInitFailure$2 = "Lỗi: Không thể khởi tạo trình soạn thảo địa điểm";
var sharedWikipedia$1 = "wikipedia";
var synchronized$2 = "đã đồng bộ.";
var submitApiError$2 = "Lỗi: Máy chủ trả về lỗi khi cố gắng lưu địa điểm, vui lòng thử lại";
var submitBlacklistError$2 = "Lỗi: Một giá trị trong dữ liệu đã gửi nằm trong danh sách đen, vui lòng xóa dữ liệu bị cấm và thử lại";
var submitUnknownError$2 = "Lỗi: Đã xảy ra lỗi không xác định khi cố gắng lưu địa điểm, vui lòng thử lại";
var submitHttpError$2 = "Lỗi: Máy chủ phản hồi với lỗi HTTP khi cố gắng lưu địa điểm, vui lòng thử lại";
var submitEmptyError$2 = "Lỗi: Máy chủ trả về phản hồi trống khi cố gắng lưu địa điểm, vui lòng thử lại";
var viewCommonsPage$2 = "xem trang Commons";
var viewWikidataPage$2 = "xem khoản mục Wikidata";
var viewWikipediaPage$2 = "xem trang Wikipedia";
var wikidataSharedMatch$2 = "Không tìm thấy sự khác biệt giữa giá trị cục bộ và Wikidata";
var wikidataShared$2 = "Dữ liệu sau đã được tìm thấy trong khoản mục Wikidata chung. Cập nhật các trường chung bằng các giá trị này?";
var wikidataSharedNotFound$2 = "Không tìm thấy dữ liệu chung trong khoản mục Wikidata";
var wikidataSyncBlurb$2 = "Chọn một giá trị sẽ thay đổi cả hai trang web để khớp nhau (chọn một giá trị trống sẽ xóa khỏi cả hai). Không chọn gì sẽ không thay đổi. Vui lòng nghiêng về việc chọn một trong các giá trị thay vì bỏ qua - có rất ít trường hợp chúng ta nên cố ý có giá trị khác.<p>Bạn được khuyến khích truy cập khoản mục Wikidata và thêm nguồn tham khảo cho bất kỳ dữ liệu nào bạn thay đổi.";
var editSummary$2 = "Tóm lược sửa đổi";
var name$2 = "Tên";
var alt$1 = "Tên khác";
var website$2 = "Trang web";
var address$2 = "Địa chỉ";
var directions$2 = "Hướng dẫn";
var phone$2 = "Điện thoại";
var tollfree$2 = "Miễn phí";
var fax$2 = "Fax";
var lastUpdated$1 = "Cập nhật lần cuối";
var syncWikidata$2 = "Đồng bộ các trường chung với/từ Wikidata";
var syncWikidataTitle$2 = "Điều này chỉ đơn giản lấy các giá trị từ Wikidata và thay thế các giá trị cục bộ. Hữu ích cho địa điểm mới.";
var syncWikidataLabel$2 = "(truy xuất nhanh)";
var content$2 = "Nội dung";
var minorTitle$2 = "Tích vào ô nếu thay đổi đối với địa điểm là nhỏ, chẳng hạn như sửa lỗi chính tả";
var minorLabel$2 = "thay đổi nhỏ?";
var email$2 = "Email";
var type$2 = "Loại";
var latitude$2 = "Vĩ độ";
var longitude$2 = "Kinh độ";
var findOnMap$2 = "tìm trên bản đồ";
var hours$2 = "Giờ mở cửa";
var checkin$1 = "Nhận phòng";
var checkout$1 = "Trả phòng";
var price$2 = "Giá";
var wpWd$2 = "Lấy ID từ bài viết Wikipedia";
var wikidataRemoveTitle$2 = "Xóa khoản mục Wikidata khỏi địa điểm này";
var wikidataRemoveLabel$2 = "xóa";
var image$3 = "Hình ảnh";
var listingTooltip$2 = "Tích vào ô nếu doanh nghiệp không còn hoạt động hoặc nếu địa điểm nên bị xóa vì lý do khác, và nó sẽ bị xóa khỏi bài viết này";
var listingLabel$2 = "xóa địa điểm này?";
var listingUpdatedTooltip$1 = "Tích vào ô nếu thông tin trong địa điểm này là có thật và chính xác, và ngày cập nhật lần cuối sẽ được thay đổi thành ngày hiện tại";
var listingUpdatedLabel$1 = "đánh dấu địa điểm là đã cập nhật?";
var natlCurrencyTitle$2 = "";
var intlCurrenciesTitle$2 = "";
var require$$1 = {
	"report-bug": "Báo cáo lỗi",
	"listing-editor-version": "Phiên bản $1",
	"coordinates-error": "Tọa độ không hợp lệ. Vui lòng sử dụng độ thập phân.",
	"placeholder-name": "tên địa điểm",
	"placeholder-alt": "còn được gọi là",
	"placeholder-url": "https://www.example.com",
	"placeholder-address": "địa chỉ của địa điểm",
	"placeholder-directions": "làm thế nào để đến đây",
	"placeholder-phone": "+55 555 555 5555",
	"placeholder-tollfree": "+1 800 100 1000",
	"placeholder-fax": "+55 555 555 555",
	"placeholder-email": "info@example.com",
	"placeholder-lastedit": "2020-01-15",
	"placeholder-lat": "11.11111",
	"placeholder-long": "111.11111",
	"placeholder-hours": "9AM-5PM hoặc 09:00-17:00",
	"placeholder-checkin": "giờ nhận phòng",
	"placeholder-checkout": "giờ trả phòng",
	"placeholder-price": "giá vé hoặc dịch vụ",
	"placeholder-wikidata-label": "khoản mục wikidata",
	"placeholder-wikipedia": "bài viết wikipedia",
	"placeholder-image": "hình ảnh địa điểm",
	"placeholder-content": "mô tả địa điểm",
	"placeholder-summary": "lý do thay đổi địa điểm",
	propertyP625: propertyP625,
	propertyP856: propertyP856$1,
	propertyP968: propertyP968,
	propertyP238: propertyP238,
	propertyP18: propertyP18$1,
	addTitle: addTitle$3,
	editTitle: editTitle$3,
	addTitleBeta: addTitleBeta$1,
	editTitleBeta: editTitleBeta$1,
	syncTitle: syncTitle$2,
	saving: saving$3,
	submit: submit$3,
	cancel: cancel$3,
	cancelAll: cancelAll$2,
	preview: preview$2,
	previewOff: previewOff$2,
	refresh: refresh$2,
	refreshTitle: refreshTitle$2,
	selectAll: selectAll$2,
	selectAlternatives: selectAlternatives$2,
	validationEmptyListing: validationEmptyListing$3,
	validationEmail: validationEmail$3,
	validationWikipedia: validationWikipedia$3,
	validationImage: validationImage$3,
	added: added$3,
	updated: updated$3,
	removed: removed$3,
	helpPage: helpPage$3,
	enterCaptcha: enterCaptcha$3,
	externalLinks: externalLinks$3,
	licenseText: licenseText$2,
	ajaxInitFailure: ajaxInitFailure$2,
	sharedWikipedia: sharedWikipedia$1,
	synchronized: synchronized$2,
	submitApiError: submitApiError$2,
	submitBlacklistError: submitBlacklistError$2,
	submitUnknownError: submitUnknownError$2,
	submitHttpError: submitHttpError$2,
	submitEmptyError: submitEmptyError$2,
	viewCommonsPage: viewCommonsPage$2,
	viewWikidataPage: viewWikidataPage$2,
	viewWikipediaPage: viewWikipediaPage$2,
	wikidataSharedMatch: wikidataSharedMatch$2,
	wikidataShared: wikidataShared$2,
	wikidataSharedNotFound: wikidataSharedNotFound$2,
	wikidataSyncBlurb: wikidataSyncBlurb$2,
	editSummary: editSummary$2,
	name: name$2,
	alt: alt$1,
	website: website$2,
	address: address$2,
	directions: directions$2,
	phone: phone$2,
	tollfree: tollfree$2,
	fax: fax$2,
	lastUpdated: lastUpdated$1,
	syncWikidata: syncWikidata$2,
	syncWikidataTitle: syncWikidataTitle$2,
	syncWikidataLabel: syncWikidataLabel$2,
	content: content$2,
	minorTitle: minorTitle$2,
	minorLabel: minorLabel$2,
	email: email$2,
	type: type$2,
	latitude: latitude$2,
	longitude: longitude$2,
	findOnMap: findOnMap$2,
	hours: hours$2,
	checkin: checkin$1,
	checkout: checkout$1,
	price: price$2,
	wpWd: wpWd$2,
	wikidataRemoveTitle: wikidataRemoveTitle$2,
	wikidataRemoveLabel: wikidataRemoveLabel$2,
	image: image$3,
	listingTooltip: listingTooltip$2,
	listingLabel: listingLabel$2,
	listingUpdatedTooltip: listingUpdatedTooltip$1,
	listingUpdatedLabel: listingUpdatedLabel$1,
	natlCurrencyTitle: natlCurrencyTitle$2,
	intlCurrenciesTitle: intlCurrenciesTitle$2
};

var addTitle$2 = "ajouter un titre";
var editTitle$2 = "Éditer un élément de listing existant";
var add = "ajouter un élément de listing";
var edit = "éditer";
var saving$2 = "Enregistrer...";
var submit$2 = "Soumettre";
var cancel$2 = "Annuler";
var validationEmptyListing$2 = "Entrez au moins un nom ou une adresse";
var validationEmail$2 = "Controler que l'adresse électronique soit correcte";
var validationWikipedia$2 = "Veuillez insérer le titre de la page Wikipédia seulement; Pas l'adresse URL complète";
var validationImage$2 = "Veuillez insérer le titre de l'image de Commons sans préfixe";
var image$2 = "Fichier";
var added$2 = "Listing ajouté pour ";
var updated$2 = "Listing mis à jour: ";
var removed$2 = "Listing effacé ";
var helpPage$2 = "//fr.wikivoyage.org/wiki/Aide:Éditeur_de_Listing";
var enterCaptcha$2 = "Entrez le CAPTCHA";
var externalLinks$2 = "Votre contribution inclus des liens externes.";
var require$$2 = {
	addTitle: addTitle$2,
	editTitle: editTitle$2,
	add: add,
	edit: edit,
	saving: saving$2,
	submit: submit$2,
	cancel: cancel$2,
	validationEmptyListing: validationEmptyListing$2,
	validationEmail: validationEmail$2,
	validationWikipedia: validationWikipedia$2,
	validationImage: validationImage$2,
	image: image$2,
	added: added$2,
	updated: updated$2,
	removed: removed$2,
	helpPage: helpPage$2,
	enterCaptcha: enterCaptcha$2,
	externalLinks: externalLinks$2
};

var addTitle$1 = "Tambah Butir Baru";
var editTitle$1 = "Sunting Butir yang Ada";
var addTitleBeta = "Tambah Butir Baru (Beta)";
var editTitleBeta = "Sunting Butir yang Ada (Beta)";
var syncTitle$1 = "Sinkron ke Wikidata";
var saving$1 = "Menyimpan...";
var submit$1 = "Kirim";
var cancel$1 = "Batal";
var cancelAll$1 = "hapus semua";
var preview$1 = "Pratinjau";
var previewOff$1 = "Pratinjau mati";
var refresh$1 = "↺";
var refreshTitle$1 = "Segarkan pratinjau";
var selectAll$1 = "Pilih semua";
var selectAlternatives$1 = "Pilih semua nilai yang nama alternatifnya kosong.";
var validationEmptyListing$1 = "Silakan masukkan nama atau alamat tempat";
var validationEmail$1 = "Pastikan alamat surelnya sudah benar";
var validationWikipedia$1 = "Mohon hanya masukkan judul halaman Wikipedia; bukan alamat URL lengkapnya";
var validationImage$1 = "Harap masukkan judul gambar Commons saja tanpa bagian awalannya";
var added$1 = "Menambahkan butir senarai ";
var updated$1 = "Memperbarui butir senarai ";
var removed$1 = "Menghapus butir senarai ";
var helpPage$1 = "//id.wikivoyage.org/wiki/Wikiwisata:Penyunting_senarai";
var enterCaptcha$1 = "Masukkan CAPTCHA";
var externalLinks$1 = "Hasil suntingan Anda menyertakan pranala luar yang baru.";
var licenseText$1 = "Dengan mengeklik \"Kirim\", Anda menyetujui <a class=\"external\" target=\"_blank\" href=\"//wikimediafoundation.org/wiki/Terms_of_use\">Ketentuan Penggunaan</a>, dan Anda secara tidak dapat ditarik kembali setuju untuk merilis kontribusi Anda di bawah <a class=\"external\" target=\"_blank\" href=\"//en.wikivoyage.org/wiki/Wikivoyage:Full_text_of_the_Attribution-ShareAlike_3.0_license\">Lisensi CC-BY-SA 3.0</a>. Anda setuju bahwa tautan atau URL saja sudah cukup untuk atribusi di bawah lisensi Creative Commons.";
var ajaxInitFailure$1 = "Galat: Unable to initialize the listing editor";
var synchronized$1 = "tersinkronisasi.";
var submitApiError$1 = "Galat: Server mengembalikan kesalahan saat mencoba menyimpan butir senarai, silakan coba lagi";
var submitBlacklistError$1 = "Galat: Nilai dalam data yang dikirimkan telah masuk daftar hitam, harap hapus pola yang masuk daftar hitam dan coba lagi";
var submitUnknownError$1 = "Galat: Terjadi kesalahan yang tidak diketahui saat mencoba menyimpan butir senarai, silakan coba lagi";
var submitHttpError$1 = "Galat: Server merespons dengan kesalahan HTTP saat mencoba menyimpan butir senarai, silakan coba lagi";
var submitEmptyError$1 = "Galat: Server mengembalikan respons kosong saat mencoba menyimpan butir senarai, silakan coba lagi";
var viewCommonsPage$1 = "lihat laman Commons";
var viewWikidataPage$1 = "lihat entri Wikidata";
var viewWikipediaPage$1 = "lihat halaman Wikipedia";
var wikidataSharedMatch$1 = "Tidak ditemukan perbedaan antara nilai data lokal dengan Wikidata";
var wikidataShared$1 = "Data berikut ditemukan dalam rekaman bersama Wikidata. Perbarui kolom bersama menggunakan nilai-nilai itu?";
var wikidataSharedNotFound$1 = "Tidak ada data bersama yang ditemukan di repositori Wikidata";
var wikidataSyncBlurb$1 = "Memilih salah satu nilai data akan mengubah kedua situs web agar sesuai (memilih nilai kosong akan menghapus data dari keduanya). Tidak memilih salah satu pun juga takkan mengubah apa pun. Mohon pilih salah satu nilai alih-alih melewatkannya - ada beberapa kasus di mana kita sebaiknya sengaja memilih nilai yang berbeda.<p>Anda disarankan untuk membuka butir Wikidata dan menambahkan referensi untuk setiap data yang Anda ubah.";
var editSummary$1 = "Ringkasan Suntingan";
var name$1 = "Nama";
var website$1 = "Situs web";
var address$1 = "Alamat";
var directions$1 = "Pentujuk arah";
var phone$1 = "Telepon";
var tollfree$1 = "Bebas pulsa";
var fax$1 = "Faks";
var lastUpdated = "Terakhir Diperbarui";
var syncWikidata$1 = "Sinkronkan bidang ke/dari Wikidata";
var syncWikidataTitle$1 = "Ini hanya mengambil data dari Wikidata dan memasukannya ke bidang lokal. Berguna saat membuat butir senarai baru.";
var syncWikidataLabel$1 = "(tarik data)";
var content$1 = "Konten";
var minorTitle$1 = "Centang kotak ini jika perubahan pada butir senarai tersebut bersifat kecil, seperti koreksi kesalahan ketik.";
var minorLabel$1 = "suntingan kecil?";
var email$1 = "Surel";
var type$1 = "Jenis";
var latitude$1 = "Lintang";
var longitude$1 = "Bujur";
var findOnMap$1 = "cari di peta";
var hours$1 = "Jam buka";
var price$1 = "Harga";
var wpWd$1 = "Dapatkan ID dari artikel Wikipedia";
var wikidataRemoveTitle$1 = "Hapus entri Wikidata dari butir senarai ini";
var wikidataRemoveLabel$1 = "hapus";
var image$1 = "Gambar";
var listingTooltip$1 = "Centang kotak ini jika bisnis tersebut tidak beroperasi lagi atau karena alasan lain, sehingga butir senarai tersebut akan dihapus dari artikel ini";
var listingLabel$1 = "hapus butir ini?";
var listingUpdatedTooltip = "Centang kotak ini jika informasi dalam butir senarai ini telah diverifikasi sebagai informasi terkini dan akurat, sehingga  tanggal pembaruan terakhir akan diubah ke tanggal hari ini";
var listingUpdatedLabel = "tandai butir senarai sebagai yang terkini?";
var natlCurrencyTitle$1 = "Mata uang Nasional";
var intlCurrenciesTitle$1 = "Mata uang Internasional";
var require$$3 = {
	"report-bug": "Lapor kekutu",
	"listing-editor-version": "Versi $1",
	"coordinates-error": "Format koordinat yang dimasukkan tidak valid. Harap gunakan derajat desimal.",
	"placeholder-name": "nama tempat",
	"placeholder-alt": "dikenal juga",
	"placeholder-url": "https://www.contoh.com",
	"placeholder-address": "alamat tempat",
	"placeholder-directions": "cara ke sini",
	"placeholder-email": "info@contoh.com",
	"placeholder-lastedit": "2020-01-15",
	"placeholder-hours": "9AM-5PM atau 09:00-17:00",
	"placeholder-checkin": "waktu check-in",
	"placeholder-checkout": "waktu check-out",
	"placeholder-price": "harga masuk atau jasa",
	"placeholder-wikidata-label": "butir wikidata",
	"placeholder-wikipedia": "artikel wikipedia",
	"placeholder-image": "gambar tempat",
	"placeholder-content": "deskripsi tempat",
	"placeholder-summary": "alasan perubahan butir",
	addTitle: addTitle$1,
	editTitle: editTitle$1,
	addTitleBeta: addTitleBeta,
	editTitleBeta: editTitleBeta,
	syncTitle: syncTitle$1,
	saving: saving$1,
	submit: submit$1,
	cancel: cancel$1,
	cancelAll: cancelAll$1,
	preview: preview$1,
	previewOff: previewOff$1,
	refresh: refresh$1,
	refreshTitle: refreshTitle$1,
	selectAll: selectAll$1,
	selectAlternatives: selectAlternatives$1,
	validationEmptyListing: validationEmptyListing$1,
	validationEmail: validationEmail$1,
	validationWikipedia: validationWikipedia$1,
	validationImage: validationImage$1,
	added: added$1,
	updated: updated$1,
	removed: removed$1,
	helpPage: helpPage$1,
	enterCaptcha: enterCaptcha$1,
	externalLinks: externalLinks$1,
	licenseText: licenseText$1,
	ajaxInitFailure: ajaxInitFailure$1,
	synchronized: synchronized$1,
	submitApiError: submitApiError$1,
	submitBlacklistError: submitBlacklistError$1,
	submitUnknownError: submitUnknownError$1,
	submitHttpError: submitHttpError$1,
	submitEmptyError: submitEmptyError$1,
	viewCommonsPage: viewCommonsPage$1,
	viewWikidataPage: viewWikidataPage$1,
	viewWikipediaPage: viewWikipediaPage$1,
	wikidataSharedMatch: wikidataSharedMatch$1,
	wikidataShared: wikidataShared$1,
	wikidataSharedNotFound: wikidataSharedNotFound$1,
	wikidataSyncBlurb: wikidataSyncBlurb$1,
	editSummary: editSummary$1,
	name: name$1,
	website: website$1,
	address: address$1,
	directions: directions$1,
	phone: phone$1,
	tollfree: tollfree$1,
	fax: fax$1,
	lastUpdated: lastUpdated,
	syncWikidata: syncWikidata$1,
	syncWikidataTitle: syncWikidataTitle$1,
	syncWikidataLabel: syncWikidataLabel$1,
	content: content$1,
	minorTitle: minorTitle$1,
	minorLabel: minorLabel$1,
	email: email$1,
	type: type$1,
	latitude: latitude$1,
	longitude: longitude$1,
	findOnMap: findOnMap$1,
	hours: hours$1,
	price: price$1,
	wpWd: wpWd$1,
	wikidataRemoveTitle: wikidataRemoveTitle$1,
	wikidataRemoveLabel: wikidataRemoveLabel$1,
	image: image$1,
	listingTooltip: listingTooltip$1,
	listingLabel: listingLabel$1,
	listingUpdatedTooltip: listingUpdatedTooltip,
	listingUpdatedLabel: listingUpdatedLabel,
	natlCurrencyTitle: natlCurrencyTitle$1,
	intlCurrenciesTitle: intlCurrenciesTitle$1
};

var propertyP856 = [
	"sito"
];
var propertyP18 = [
	"immagine"
];
var budget = "Prezzi modici";
var midrange = "Prezzi medi";
var splurge = "Prezzi elevati";
var editSummary = "Oggetto della modifica";
var name = "Nome";
var alt = "Altro nome";
var website = "Sito web";
var address = "Indirizzo";
var directions = "Indicazioni";
var phone = "Telefono";
var tollfree = "Numero verde";
var fax = "Fax";
var content = "Descrizione";
var preview = "Anteprima";
var email = "Email";
var type = "Tipo";
var latitude = "Latitudine";
var longitude = "Longitudine";
var findOnMap = "localizza su geomap";
var hours = "Orari";
var checkin = "Check-in";
var checkout = "Check-out";
var price = "Prezzo";
var wpWd = "Ottieni l'ID dalla voce Wikipedia";
var wikidataRemoveTitle = "Cancella l'istanza Wikidata da questo elemento";
var wikidataRemoveLabel = "rimuovi";
var image = "Immagine";
var listingTooltip = "Spunta il riquadro se l'attività non è più operativa, al fine di rimuoverla da questo articolo";
var listingLabel = "Cancello?";
var minorTitle = "Spunta il riquadro se la modifica dell'elemento non è rilevante, come la correzione di un refuso";
var minorLabel = "modifica minore?";
var syncWikidata = "Uniforma le informazioni con Wikidata";
var syncWikidataTitle = "Questo semplicemente prende i valori da Wikidata sostituendoli a quelli locali. Utile per i nuovi listings.";
var syncWikidataLabel = "(inserimento rapido)";
var externalLinks = "La tua modifica include nuovi collegamenti esterni.";
var addTitle = "Aggiungi un nuovo elemento";
var editTitle = "Modifica l'elemento esistente";
var syncTitle = "Wikidata Sync";
var saving = "Salvataggio...";
var submit = "Salva";
var cancel = "Annulla";
var cancelAll = "Annulla tutto";
var previewOff = "Niente anteprima";
var refresh = "↺";
var refreshTitle = "Aggiorna anteprima";
var selectAll = "Seleziona tutto";
var selectAlternatives = "Seleziona tutti i valori dove l'alternativa è vuota.";
var validationEmptyListing = "Inserisci almeno un'informazione tra nome o indirizzo";
var validationEmail = "Assicurati che l'indirizzo mail sia valido";
var validationWikipedia = "Inserisci solo il titolo della voce su Wikipedia e non l'indirizzo internet";
var validationImage = "Inserisci solo il titolo dell'immagine su Commons senza alcun prefisso";
var added = "Aggiunto elemento: ";
var updated = "Aggiornato elemento: ";
var removed = "Rimosso elemento: ";
var helpPage = "//en.wikivoyage.org/wiki/Wikivoyage:Listing_editor";
var enterCaptcha = "Inserisci il CAPTCHA";
var licenseText = "Facendo click su \"Salva\", accetti espressamente i <a class=\"external\" target=\"_blank\" href=\"http://wikimediafoundation.org/wiki/Terms_of_Use/it\">Termini d'uso</a>, e accetti irrevocabilmente a rilasciare il tuo contributo sotto la <a class=\"external\" target=\"_blank\" href=\"https://it.wikivoyage.org/wiki/Wikivoyage:Testo_della_Creative_Commons_Attribuzione-Condividi_allo_stesso_modo_3.0_Unported\">licenza CC-BY-SA 3.0</a>.";
var ajaxInitFailure = "Errore: Impossibile inizializzare il listing editor";
var sharedWikipedia = "wikipedia";
var synchronized = "- campo sincronizzato.";
var submitApiError = "Errore: Il server ha restituito un errore durante il salvataggio dell'elemento, per favore, prova ancora";
var submitBlacklistError = "Errore: Un valore nei dati inviati è in \"blacklist\", per favore rimuovilo e prova ancora";
var submitUnknownError = "Errore: Un errore sconosciuto si è verificato durante il salvataggio dell'elemento, per favore, prova ancora";
var submitHttpError = "Errore: Il server ha risposto con un errore HTTP durante il salvataggio dell'elemento, per favore, prova ancora";
var submitEmptyError = "Errore: Il server ha restituito una risposta vuota durante il salvataggio dell'elemento, per favore, prova ancora";
var viewCommonsPage = "Vedi l'immagine su Commons";
var viewWikidataPage = "Vedi l'istanza su Wikidata";
var viewWikipediaPage = "Vedi la voce su Wikipedia";
var wikidataSharedMatch = "Nessuna differenza trovata tra i valori locali e quelli su Wikidata";
var wikidataShared = "I seguenti dati sono stati trovati su Wikidata. Aggiorno i relativi campi con questi valori?";
var wikidataSharedNotFound = "Nessun dato è stato recuperato da Wikidata";
var wikidataSyncBlurb = "Il valore selezionato cambierà in entrambi i siti Web in modo che corrispondano (selezionando un valore vuoto verrà eliminato da entrambi). Non selezionare nessuno dei due, non comporterà alcuna modifica. Si prega rischiare di sbagliare scegliendo uno dei valori piuttosto che non fare niente - ci sono alcuni casi in cui è preferibile avere intenzionalmente un valore diverso tra i due siti. <p> Sei incoraggiato ad andare nell'elemento Wikidata per aggiungere i riferimenti di un qualsiasi dato che cambi.";
var natlCurrencyTitle = "Simboli della valuta nazionale";
var intlCurrenciesTitle = "Simboli di valute internazionali";
var require$$4 = {
	"placeholder-name": "nome del posto",
	"placeholder-alt": "noto anche come",
	"placeholder-url": "https://www.esempio.com",
	"placeholder-address": "indirizzo del posto",
	"placeholder-directions": "come arrivare qui",
	"placeholder-phone": "+55 555 555 5555",
	"placeholder-tollfree": "+1 800 100 1000",
	"placeholder-fax": "+55 555 555 555",
	"placeholder-email": "info@esempio.com",
	"placeholder-lat": "11.11111",
	"placeholder-long": "111.11111",
	"placeholder-hours": "Lun-Ven 9:00-17:00",
	"placeholder-checkin": "orario di check in",
	"placeholder-checkout": "orario di check out",
	"placeholder-price": "prezzo e riferimento temporale (mese anno)",
	"placeholder-wikidata-label": "istanza wikidata",
	"placeholder-wikipedia": "voce wikipedia",
	"placeholder-image": "immagine del luogo",
	"placeholder-content": "descrizione del posto",
	"placeholder-summary": "Motivo di modifica dell'elemento",
	propertyP856: propertyP856,
	propertyP18: propertyP18,
	budget: budget,
	midrange: midrange,
	splurge: splurge,
	editSummary: editSummary,
	name: name,
	alt: alt,
	website: website,
	address: address,
	directions: directions,
	phone: phone,
	tollfree: tollfree,
	fax: fax,
	content: content,
	preview: preview,
	email: email,
	type: type,
	latitude: latitude,
	longitude: longitude,
	findOnMap: findOnMap,
	hours: hours,
	checkin: checkin,
	checkout: checkout,
	price: price,
	wpWd: wpWd,
	wikidataRemoveTitle: wikidataRemoveTitle,
	wikidataRemoveLabel: wikidataRemoveLabel,
	image: image,
	listingTooltip: listingTooltip,
	listingLabel: listingLabel,
	minorTitle: minorTitle,
	minorLabel: minorLabel,
	syncWikidata: syncWikidata,
	syncWikidataTitle: syncWikidataTitle,
	syncWikidataLabel: syncWikidataLabel,
	externalLinks: externalLinks,
	addTitle: addTitle,
	editTitle: editTitle,
	syncTitle: syncTitle,
	saving: saving,
	submit: submit,
	cancel: cancel,
	cancelAll: cancelAll,
	previewOff: previewOff,
	refresh: refresh,
	refreshTitle: refreshTitle,
	selectAll: selectAll,
	selectAlternatives: selectAlternatives,
	validationEmptyListing: validationEmptyListing,
	validationEmail: validationEmail,
	validationWikipedia: validationWikipedia,
	validationImage: validationImage,
	added: added,
	updated: updated,
	removed: removed,
	helpPage: helpPage,
	enterCaptcha: enterCaptcha,
	licenseText: licenseText,
	ajaxInitFailure: ajaxInitFailure,
	sharedWikipedia: sharedWikipedia,
	synchronized: synchronized,
	submitApiError: submitApiError,
	submitBlacklistError: submitBlacklistError,
	submitUnknownError: submitUnknownError,
	submitHttpError: submitHttpError,
	submitEmptyError: submitEmptyError,
	viewCommonsPage: viewCommonsPage,
	viewWikidataPage: viewWikidataPage,
	viewWikipediaPage: viewWikipediaPage,
	wikidataSharedMatch: wikidataSharedMatch,
	wikidataShared: wikidataShared,
	wikidataSharedNotFound: wikidataSharedNotFound,
	wikidataSyncBlurb: wikidataSyncBlurb,
	natlCurrencyTitle: natlCurrencyTitle,
	intlCurrenciesTitle: intlCurrenciesTitle
};

const en = require$$0;
const vi = require$$1;
const fr = require$$2;
const id = require$$3;
const it = require$$4;
var translations = {
    en,
    vi,
    fr,
    id,
    it
};

/**
 * @param {Object<string,string>} translations
 * @return {string}
 */

var makeTranslateFunction$2 = ( translations ) => {
    return ( key, params = [] ) => {
        let msg =  translations[ key ];
        if ( msg === undefined ) {
            throw new Error( `Could not find undefined message ${key}` );
        } else {
            params.forEach( ( value, i ) => {
                msg = msg.replace( `$${i + 1}`, value );
            } );
            return msg;
        }
    };
};

/**
 * Convert splitted elements of coordinates in DMS notation into DD notation.
 * If the input is already in DD notation (i.e. only degrees is a number), input value is returned unchanged.
 * Notes:
 * 1) Each D, M & S is checked to be a valid number plus M & S are checked to be in a valid range. If one parameter is not valid, NaN (Not a Number) is returned
 * 2) Empty string (provided from initial parsing section in parseDMS) are considered valid by isNaN function (i.e. isNaN('') is false)
 */

var convertDMS2DD = function(degrees, minutes, seconds, direction) {
    var dd = NaN;
    if( isNaN(degrees) )
        return NaN;
    else {
        degrees = Number(degrees);
        if( degrees <= -180 || degrees > 180 )
            return NaN;
        else
            dd = degrees;
    }
    if( isNaN(minutes) )
        return NaN;
    else {
        degrees = Number(minutes);
        if( minutes < 0 || minutes >= 60 )
            return NaN;
        else
            dd = dd + minutes/60;
    }
    if( isNaN(seconds) )
        return NaN;
    else {
        degrees = Number(seconds);
        if( seconds < 0 || seconds >= 60 )
            return NaN;
        else
            dd = dd + seconds/(3600);
    }
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    } // Don't do anything for N or E
    return dd;
};

/**
 * Parse coordinates in DMS notation, to convert it into DD notation in Wikidata format (i.e. without "°" symbol).
 * If the input is already in DD notation, input value is returned unchanged.
 * Notes:
 * 1) Common notation is use as a proforma for potential future use because the split currently works to be more flexible skipping any char that is not a number, a minus, a dot or a cardinal point
 * 2) Missing parts are forced to be empty to use a common approach, altough M & S could be also "0" in fact North America coords 48°N 100°W are equivalent to 48° 0' 0" N, 100° 0' 0" W,
 *    but for compatibility with the DD notation where there is no alternative way to write it (i.e. 48° -100°), so the following parts are just empty, not 0
 * 3) The parsed parts could have also erroneous data if the input is badly formatted (e.g. 48°EE'00"N 100°00'4000""W"), but these checks will be performed inside convertDMS2DD
 */
var parseDMS$1 = function(input) {
    // Uniform alternative notation, into one common notation DD° MM' SS" [NSEW], then the DMS components are splitted into its 4 atomic component
    var parts = input.toString()
        .replace(/[‘’′]/g, "'")
        .replace(/[“”″]/g, '"')
        .replace(/''/g, '"')
        .replace(/−/g, '-')
        .replace(/[_/\t\n\r]/g, " ")
        .replace(/\s/g, '')
        .replace(/([°'"])/g,"$1 ")
        .replace(/([NSEW])/gi, function(v) { return ` ${v.toUpperCase()}`; })
        // eslint-disable-next-line no-useless-escape
        .replace(/(^ [NSEW])(.*)/g,"$2$1").split(/[^\d\w\.-]+/);
    for (var i=0; i<4; i++)
        if( !parts[i] )
            parts[i] = '';
    return convertDMS2DD( parts[0], parts[1], parts[2], parts[3] );
};

var parseDMS_1 = parseDMS$1;

const PAGE_VIEW_LANGUAGE = mw.config.get( 'wgPageViewLanguage' );
const COMMONS_URL = '//commons.wikimedia.org';
const WIKIDATA_URL = '//www.wikidata.org';
const WIKIPEDIA_URL = `//${PAGE_VIEW_LANGUAGE}.wikipedia.org`;
const WIKIDATA_SITELINK_WIKIPEDIA = `${PAGE_VIEW_LANGUAGE}wiki`;
const LANG$1 = mw.config.get( 'wgUserLanguage', 'en' );

var globalConfig = {
    LANG: LANG$1,
    WIKIDATA_SITELINK_WIKIPEDIA,
    WIKIPEDIA_URL,
    WIKIDATA_URL,
    COMMONS_URL
};

const makeTranslateFunction$1 = makeTranslateFunction$2;
let internalTranslateFn;

const translate = ( key, ...parameters ) => {
    if ( !internalTranslateFn ) {
        throw 'Translations not setup';
    } else {
        return internalTranslateFn( key, ...parameters );
    }
};

const init = ( TRANSLATIONS ) => {
    internalTranslateFn = makeTranslateFunction$1( TRANSLATIONS );
};

var translate_1 = {
    translate,
    init
};

let Callbacks = {};

const loadCallbacks$1 = ( callbacks ) => {
    Callbacks = callbacks;
};

const getCallbacks = ( key ) => {
    return Callbacks[key] || [];
};

var Callbacks_1 = {
    getCallbacks,
    loadCallbacks: loadCallbacks$1
};

let config = {};

let _loaded = false;
const loadConfig$1 = ( newConfig, projectConfig ) => {
    if ( _loaded ) {
        mw.log.warn( 'Configuration was already loaded. @todo: fix this!' );
    }
    _loaded = true;
    config = Object.assign( {}, newConfig, projectConfig );
};

const getConfig = () => config;

var Config = {
    loadConfig: loadConfig$1,
    getConfig
};

var selectors;
var hasRequiredSelectors;

function requireSelectors () {
	if (hasRequiredSelectors) return selectors;
	hasRequiredSelectors = 1;
	// these selectors should match a value defined in the EDITOR_FORM_HTML
	// if the selector refers to a field that is not used by a Wikivoyage
	// language version the variable should still be defined, but the
	// corresponding element in EDITOR_FORM_HTML can be removed and thus
	// the selector will not match anything and the functionality tied to
	// the selector will never execute.
	selectors = {
	    EDITOR_FORM_SELECTOR: '#listing-editor',
	    EDITOR_MINOR_EDIT_SELECTOR: '#input-minor',
	    EDITOR_CLOSED_SELECTOR: '#input-closed',
	    EDITOR_SUMMARY_SELECTOR: '#input-summary'
	};
	return selectors;
}

var html$1;
var hasRequiredHtml$1;

function requireHtml$1 () {
	if (hasRequiredHtml$1) return html$1;
	hasRequiredHtml$1 = 1;
	const INTL_CURRENCIES = [ '€', '$', '£', '¥', '₩' ];
	const CURRENCY_CHOICES = INTL_CURRENCIES.map( function ( c ) {
	    return `<span class="listing-charinsert" data-for="input-price"> <a href="javascript:">${c}</a></span>`;
	} ).join( '' );

	html$1 = ( translate, SPECIAL_CHARS, showLastEditedField ) => {
	    let SPECIAL_CHARS_STRING = SPECIAL_CHARS.map( function ( char ) {
	        return `<span class="listing-charinsert" data-for="input-content"> <a href="javascript:">${char}</a></span>`;
	    } ).join( '\n' );
	    if (SPECIAL_CHARS.length) {
	        SPECIAL_CHARS_STRING = `<br />(${SPECIAL_CHARS_STRING}&nbsp;)`;
	    }
	    return `<form id="listing-editor">
    <div class="listing-col">
        <div class="editor-fullwidth">
        <div id="div_name" class="editor-row">
            <div class="editor-label-col"><label for="input-name">${translate( 'name' )}</label></div>
            <div><input type="text" class="editor-fullwidth" id="input-name"></div>
        </div>
        <div id="div_alt" class="editor-row">
            <div class="editor-label-col"><label for="input-alt">${translate( 'alt' )}</label></div>
            <div><input type="text" class="editor-fullwidth" id="input-alt"></div>
        </div>
        <div id="div_address" class="editor-row">
            <div class="editor-label-col"><label for="input-address">${translate( 'address' )}</label></div>
            <div><input type="text" class="editor-fullwidth" id="input-address"></div>
        </div>
        <div id="div_directions" class="editor-row">
            <div class="editor-label-col"><label for="input-directions">${translate( 'directions' )}</label></div>
            <div><input type="text" class="editor-fullwidth" id="input-directions"></div>
        </div>
        <div id="div_phone" class="editor-row">
            <div class="editor-label-col"><label for="input-phone">${translate( 'phone' )}</label></div>
            <div class="editor-fullwidth">
                <input type="text" class="editor-fullwidth" id="input-phone">
                <div class="input-cc" data-for="input-phone"></div>
            </div>
        </div>
        <div id="div_tollfree" class="editor-row">
            <div class="editor-label-col">
                <label for="input-tollfree">${translate( 'tollfree' )}</label>
            </div>
            <div class="editor-fullwidth">
                <input type="text" class="editor-fullwidth" id="input-tollfree">
                <div class="input-cc" data-for="input-tollfree"></div>
            </div>
        </div>
        <div id="div_fax" class="editor-row">
            <div class="editor-label-col"><label for="input-fax">${translate( 'fax' )}</label></div>
            <div class="editor-fullwidth"><input type="text" class="editor-fullwidth" id="input-fax">
                <div class="input-cc" data-for="input-fax"></div>
            </div>
        </div>
        <div id="div_hours" class="editor-row">
            <div class="editor-label-col"><label for="input-hours">${translate( 'hours' )}</label></div>
            <div><input type="text" class="editor-fullwidth" id="input-hours"></div>
        </div>
        <div id="div_checkin" class="editor-row">
            <div class="editor-label-col"><label for="input-checkin">${translate( 'checkin' )}</label></div>
            <div><input type="text" class="editor-fullwidth" id="input-checkin"></div>
        </div>
        <div id="div_checkout" class="editor-row">
            <div class="editor-label-col">
                <label for="input-checkout">${translate( 'checkout' )}</label>
            </div>
            <div><input type="text" class="editor-fullwidth" id="input-checkout"></div>
        </div>
        <div id="div_price" class="editor-row">
            <div class="editor-label-col"><label for="input-price">${translate( 'price' )}</label></div>
            <!-- update the Callbacks.initStringFormFields
                method if the currency symbols are removed or modified -->
            <div class="editor-fullwidth"><input type="text" class="editor-fullwidth" id="input-price">
                <div class="input-price">
                    <span id="span_natl_currency" title="${translate( 'natlCurrencyTitle' )}"></span>
                    <span id="span_intl_currencies" title="${translate( 'intlCurrenciesTitle' )}">${
	                        CURRENCY_CHOICES
	                    }</span>
                </div>
            </div>
        </div>
        <div id="div_lastedit" style="display: none;">
            <div class="editor-label-col">
                <label for="input-lastedit">${translate( 'lastUpdated' )}</label>
            </div>
            <div><input type="text" size="10" id="input-lastedit"></div>
        </div>
        </div>
    </div>
    <div class="listing-col">
        <div class="editor-fullwidth">
        <div id="div_type" class="editor-row">
            <div class="editor-label-col">
                <label for="input-type">${translate( 'type' )}</label>
            </div>
            <div>
                <select id="input-type">
                    <!-- appended dynamically -->
                </select>
            </div>
            <div class="editor-fullwidth">
                <span id="span-closed">
                    <input type="checkbox" id="input-closed">
                    <label for="input-closed"
                        class="listing-tooltip"
                        title="${translate( 'listingTooltip' )}">${translate( 'listingLabel' )}</label>
                </span>
            </div>
        </div>
        <div id="div_url" class="editor-row">
            <div class="editor-label-col">
                <label for="input-url">${translate( 'website' )}<span class="wikidata-update"></span></label>
            </div>
            <div><input type="text" class="editor-fullwidth" id="input-url"></div>
        </div>
        <div id="div_email" class="editor-row">
            <div class="editor-label-col"><label for="input-email">${translate( 'email' )}<span class="wikidata-update"></span></label></div>
            <div><input type="text" class="editor-fullwidth" id="input-email"></div>
        </div>
        <div id="div_lat" class="editor-row">
            <div class="editor-label-col">
                <label for="input-lat">${translate( 'latitude' )}<span class="wikidata-update"></span></label>
            </div>
            <div>
                <input type="text" class="editor-partialwidth" id="input-lat">
                <!-- update the Callbacks.initFindOnMapLink
                method if this field is removed or modified -->
                <div class="input-other">
                    <a id="geomap-link"
                        target="_blank"
                        href="https://wikivoyage.toolforge.org/w/geomap.php">${translate( 'findOnMap' )}
                    </a>
                </div>
            </div>
        </div>
        <div id="div_long" class="editor-row">
            <div class="editor-label-col">
                <label for="input-long">${translate( 'longitude' )}<span class="wikidata-update"></span></label>
            </div>
            <div>
                <input type="text" class="editor-partialwidth" id="input-long">
            </div>
        </div>
        <sistersites></sistersites>
        </div>
    </div>
    <div id="div_content" class="editor-row">
        <div class="editor-label-col"><label for="input-content">${translate( 'content' )
	        }${SPECIAL_CHARS_STRING}</label></div>
        <div><textarea rows="8" class="editor-fullwidth" id="input-content"></textarea></div>
    </div>
    <!-- update the Callbacks.hideEditOnlyFields method if
    the status row is removed or modified -->
    <div id="div_status" class="editor-fullwidth">
        <div class="editor-label-col"><label>Status</label></div>
        <div>${
	            // update the Callbacks.updateLastEditDate
	            // method if the last edit input is removed or modified
	            showLastEditedField ? `<span id="span-last-edit">` +
	                `<input type="checkbox" id="input-last-edit" />` +
	                `<label for="input-last-edit" class="listing-tooltip" title="${translate( 'listingUpdatedTooltip' )}">${translate( 'listingUpdatedLabel' )}</label>` +
	            `</span>` : ''
	        }</div>
    </div>
    <! -- update the Callbacks.hideEditOnlyFields method if
        the summary table is removed or modified -->
    <div id="div_summary" class="editor-fullwidth">
        <div class="listing-divider"></div>
        <div class="editor-row">
            <div class="editor-label-col"><label for="input-summary">${translate( 'editSummary' )}</label></div>
            <div>
                <input type="text" class="editor-partialwidth" id="input-summary">
                <span id="span-minor">
                    <input type="checkbox" id="input-minor">
                        <label for="input-minor" class="listing-tooltip"
                            title="${translate( 'minorTitle' )}">${translate( 'minorLabel' )}</label>
                </span>
            </div>
        </div>
    </div>
    <div id="listing-preview">
        <div class="listing-divider"></div>
        <div class="editor-row">
            <div title="Preview">${translate( 'preview' )}</div>
            <div id="listing-preview-text"></div>
        </div>
    </div>
    </form>`;
	};
	return html$1;
}

var dialogs;
var hasRequiredDialogs;

function requireDialogs () {
	if (hasRequiredDialogs) return dialogs;
	hasRequiredDialogs = 1;
	function load() {
	    return mw.loader.using( 'jquery.ui' );
	}

	function destroy( selector ) {
	    document.documentElement.classList.remove( 'listing-editor-dialog-open' );
	    load().then( () => $(selector).dialog( 'destroy' ).remove() );
	}

	function open( $element, options ) {
	    load().then( () =>
	        $element.dialog(
	            Object.assign( options, {
	                height: 'auto',
	                width: 'auto'
	            } )
	        )
	    );
	    document.documentElement.classList.add( 'listing-editor-dialog-open' );
	}

	/**
	 * Closes dialog, also triggers dialogclose event.
	 * @param {string} selector
	 */
	function close( selector ) {
	    load().then( () => $(selector).dialog('close') );
	    document.documentElement.classList.remove( 'listing-editor-dialog-open' );
	}

	dialogs = {
	    destroy,
	    open,
	    close
	};
	return dialogs;
}

var templates;
var hasRequiredTemplates;

function requireTemplates () {
	if (hasRequiredTemplates) return templates;
	hasRequiredTemplates = 1;
	templates = {
	    iata: '{{IATA|%s}}'
	};
	return templates;
}

var makeSyncLinks_1;
var hasRequiredMakeSyncLinks;

function requireMakeSyncLinks () {
	if (hasRequiredMakeSyncLinks) return makeSyncLinks_1;
	hasRequiredMakeSyncLinks = 1;
	const parseDMS = parseDMS_1;
	const { LANG } = globalConfig;

	const makeSyncLinks = function(value, mode, valBool, Config) {
	    const { WIKIDATA_CLAIMS } = Config;
	    var htmlPart = '<a target="_blank" rel="noopener noreferrer"';
	    var i;
	    switch(mode) {
	        case WIKIDATA_CLAIMS.coords.p:
	            htmlPart += 'href="https://geohack.toolforge.org/geohack.php?params=';
	            for (i = 0; i < value.length; i++) { htmlPart += `${parseDMS(valBool ? $(value[i]).val() : value[i])};`; }
	            htmlPart += '_type:landmark">'; // sets the default zoom
	            break;
	        case WIKIDATA_CLAIMS.url.p:
	            htmlPart += 'href="';
	            for (i = 0; i < value.length; i++) { htmlPart += (valBool ? $(value[i]).val() : value[i]); }
	            htmlPart += '">';
	            break;
	        case WIKIDATA_CLAIMS.image.p:
	            htmlPart += `href="https://${LANG}.wikivoyage.org/wiki/File:`;
	            for (i = 0; i < value.length; i++) { htmlPart += (valBool ? $(value[i]).val() : value[i]); }
	            htmlPart += '">';
	            break;
	    }
	    return htmlPart;
	};

	makeSyncLinks_1 = makeSyncLinks;
	return makeSyncLinks_1;
}

/**
 * Trim decimal precision if it exceeds the specified number of
 * decimal places.
 * @param {number} value
 * @param {number} precision
 * @return {string}
 */

var trimDecimal_1;
var hasRequiredTrimDecimal;

function requireTrimDecimal () {
	if (hasRequiredTrimDecimal) return trimDecimal_1;
	hasRequiredTrimDecimal = 1;
	var trimDecimal = function(value, precision) {
	    if (value.toString().length > value.toFixed(precision).toString().length) {
	        return value.toFixed(precision);
	    } else {
	        return value.toString();
	    }
	};

	trimDecimal_1 = trimDecimal;
	return trimDecimal_1;
}

var createRadio_1;
var hasRequiredCreateRadio;

function requireCreateRadio () {
	if (hasRequiredCreateRadio) return createRadio_1;
	hasRequiredCreateRadio = 1;
	const makeSyncLinks = requireMakeSyncLinks();
	const parseDMS = parseDMS_1;
	const trimDecimal = requireTrimDecimal();
	const { getConfig } = Config;

	// @todo: move to template
	const createRadio = function(field, claimValue, guid) {
	    const { LISTING_TEMPLATES, WIKIDATA_CLAIMS } = getConfig();

	    var j = 0;
	    for (j = 0; j < claimValue.length; j++) {
	        if( claimValue[j] === null ) {
	            claimValue[j] = '';
	        }
	    }
	    field.label = field.label.split(/(\s+)/)[0]; // take first word
	    var html = '';
	    var editorField = [];
	    var remoteFlag = false;
	    for ( var i = 0; i < field.fields.length; i++ ) {
	        editorField[i] = `#${LISTING_TEMPLATES.listing[field.fields[i]].id}`;
	    }
	    // NOTE: this assumes a standard listing type. If ever a field in a nonstandard listing type is added to Wikidata sync, this must be changed

	    for (j = 0; j < claimValue.length; j++) {
	        // compare the present value to the Wikidata value
	        if ( field.p === WIKIDATA_CLAIMS.coords.p) {
	        //If coords, then compared the values after trimming the WD one into decimal and converting into decimal and trimming the present one
	            if((trimDecimal(Number(claimValue[j]), 6) != trimDecimal(parseDMS($(editorField[j]).val()), 6)) ) {
	                break;
	            }
	        } else if ( field.p === WIKIDATA_CLAIMS.image.p) {
	        //If image, then compared the values after converting underscores into spaces on the local value
	            if( claimValue[j] != $(editorField[j]).val().replace(/_/g, ' ') ) {
	                break;
	            }
	        } else if( claimValue[j] != $(editorField[j]).val() ) {
	            break;
	        }
	    }
	    if ( (j === claimValue.length) && (field.remotely_sync !== true) ) {
	        return '';
	    }
	    // if everything on WV equals everything on WD, skip this field

	    if ( (field.doNotUpload === true) && (claimValue[0] === '') ) {
	        return '';
	    }
	    // if do not upload is set and there is nothing on WD, skip

	    // if remotely synced, and there aren't any value(s) here or they are identical, skip with a message
	    // also create an invisible radio button so that updateFieldIfNotNull is called
	    if ( (field.remotely_sync === true) && ( j === claimValue.length || ( ( $(editorField[0]).val() === '' ) && ( ($(editorField[1]).val() === '' ) || ($(editorField[1]).val() === undefined) ) ) ) ) {
	        remoteFlag = true;
	    }
	    if ( remoteFlag === true ) {
	        html += '<div class="choose-row" style="display:none">';
	    } else {
	        html += `<div class="sync_label">${field.label}</div><div class="choose-row">`;
	    } // usual case, create heading
	    html += `<div>` +
	        `&nbsp;<label for="${field.label}-wd">`;

	    if (
	        [
	            WIKIDATA_CLAIMS.coords.p,
	            WIKIDATA_CLAIMS.url.p,
	            WIKIDATA_CLAIMS.image.p
	        ].indexOf(field.p) >= 0
	    ) {
	        html += makeSyncLinks(claimValue, field.p, false);
	    }
	    for (j = 0; j < claimValue.length; j++) {
	        html += `${claimValue[j]}\n`;
	    }
	    if (
	        [
	            WIKIDATA_CLAIMS.coords.p,
	            WIKIDATA_CLAIMS.url.p,
	            WIKIDATA_CLAIMS.image.p
	        ].indexOf(field.p) >= 0
	    ) {
	        html += '</a>';
	    }

	    html += `</label>
</div>
<div id="has-guid">
<input type="radio" id="${field.label}-wd" name="${field.label}"`;
	    if ( remoteFlag === true ) {
	        html += 'checked';
	    }
	    html += `>
<input type="hidden" value="${guid}">
</div>`;
	    if ( remoteFlag === false ) {
	        html += `<div>
    <input type="radio" name="${field.label}" checked>
</div>`;
	    }
	    html += '<div id="has-json"><input type="radio" ';
	    if ( (remoteFlag !== true) && (field.doNotUpload !== true) ) {
	        html += `id="${field.label}-wv" name="${field.label}"`;
	    } else {
	        html += 'disabled';
	    }
	    html += `><input type="hidden" value='${JSON.stringify(field)}'>
</div>
<div>&nbsp;<label for="${field.label}-wv">`;

	    if (
	        [
	            WIKIDATA_CLAIMS.coords.p,
	            WIKIDATA_CLAIMS.url.p,
	            WIKIDATA_CLAIMS.image.p
	        ].indexOf(field.p) >= 0
	    ) {
	        html += makeSyncLinks(editorField, field.p, true);
	    }
	    for (i = 0; i < editorField.length; i++ ) {
	        html += `${$(editorField[i]).val()}\n`;
	    }
	    if (
	        [
	            WIKIDATA_CLAIMS.coords.p,
	            WIKIDATA_CLAIMS.url.p,
	            WIKIDATA_CLAIMS.image.p
	        ].indexOf(field.p) >= 0
	    ) {
	        html += '</a>';
	    }

	    html += '</label></div></div>\n';
	    return html;
	};
	createRadio_1 = createRadio;
	return createRadio_1;
}

var listingEditorSync;
var hasRequiredListingEditorSync;

function requireListingEditorSync () {
	if (hasRequiredListingEditorSync) return listingEditorSync;
	hasRequiredListingEditorSync = 1;
	const { iata } = requireTemplates();
	const createRadio = requireCreateRadio();
	const trimDecimal = requireTrimDecimal();
	const dialog = requireDialogs();

	const init = ( SisterSite, Config, translate, jsonObj, wikidataRecord ) => {
	    const { wikidataClaim, wikidataWikipedia } = SisterSite;
	    const { WIKIDATA_CLAIMS } = Config;

	    let msg = `<form id="listing-editor-sync">${
	    translate( 'wikidataSyncBlurb' )
	}<p>
<fieldset>
    <span>
        <span class="wikidata-update"></span>
        <a href="javascript:" class="syncSelect" name="wd" title="${translate( 'selectAll' )}">Wikidata</a>
    </span>
    <a href="javascript:" id="autoSelect" class="listing-tooltip" title="${translate( 'selectAlternatives' )}">Auto</a>
    <span>
        <a href="javascript:" class="syncSelect" name="wv" title="${translate( 'selectAll' )}">Wikivoyage</a>
        <span class="wikivoyage-update"></span>
    </span>
</fieldset>
<div class="editor-fullwidth">`;

	    const res = {};
	    for (let key in WIKIDATA_CLAIMS) {
	        res[key] = {};
	        res[key].value = wikidataClaim(jsonObj, wikidataRecord, WIKIDATA_CLAIMS[key].p);
	        res[key].guidObj = wikidataClaim(jsonObj, wikidataRecord,
	            WIKIDATA_CLAIMS[key].p, true);
	        if (key === 'iata') {
	            if( res[key].value ) {
	                res[key].value = iata.replace( '%s', res[key].value );
	            }
	            msg += createRadio(WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj, Config);
	        } else if (key === 'email') {
	            if( res[key].value ) {
	                res[key].value = res[key].value.replace('mailto:', '');
	            }
	            msg += createRadio(WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj, Config);
	        } else if (key === 'coords') {
	            if ( res[key].value ) {
	                res[key].value.latitude = trimDecimal(res[key].value.latitude, 6);
	                res[key].value.longitude = trimDecimal(res[key].value.longitude, 6);
	                msg += createRadio(WIKIDATA_CLAIMS[key],
	                    [res[key].value.latitude, res[key].value.longitude], res[key].guidObj, Config);
	            } else {
	                msg += createRadio(WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj, Config);
	            }
	        } else msg += createRadio(WIKIDATA_CLAIMS[key], [res[key].value], res[key].guidObj, Config);
	    }
	    var wikipedia = wikidataWikipedia(jsonObj, wikidataRecord);
	    msg += createRadio( {
	            label: translate( 'sharedWikipedia' ),
	            fields: ['wikipedia'],
	            doNotUpload: true,
	            'remotely_sync': true
	        },
	        [wikipedia],
	        $('#input-wikidata-value').val(),
	        Config
	    );

	    msg += `</div><p><small><a href="javascript:" class="clear">${translate( 'cancelAll' )}</a></small>
</form>`;
	    return $( msg );
	};

	const SYNC_FORM_SELECTOR = '#listing-editor-sync';
	const destroy = () => {
	    if ($(SYNC_FORM_SELECTOR).length > 0) {
	        dialog.destroy(SYNC_FORM_SELECTOR);
	    }
	};

	const $element = () => $( SYNC_FORM_SELECTOR );

	listingEditorSync = {
	    init,
	    destroy,
	    $element
	};
	return listingEditorSync;
}

var autocompletes;
var hasRequiredAutocompletes;

function requireAutocompletes () {
	if (hasRequiredAutocompletes) return autocompletes;
	hasRequiredAutocompletes = 1;
	const { LANG } = globalConfig;

	const parseWikiDataResult = function(jsonObj) {
	    var results = [];
	    for (var i=0; i < $(jsonObj.search).length; i++) {
	        var result = $(jsonObj.search)[i];
	        var label = result.label;
	        if (result.match && result.match.text) {
	            label = result.match.text;
	        }
	        var data = {
	            value: label,
	            label,
	            description: result.description,
	            id: result.id
	        };
	        results.push(data);
	    }
	    return results;
	};

	const setupWikidataAutocomplete = ( SisterSite, form, updateLinkFunction ) => {
	    $('#input-wikidata-label', form).autocomplete({
	        // eslint-disable-next-line object-shorthand
	        source: function( request, response ) {
	            var ajaxUrl = SisterSite.API_WIKIDATA;
	            var ajaxData = {
	                action: 'wbsearchentities',
	                search: request.term,
	                language: LANG
	            };
	            var ajaxSuccess = function (jsonObj) {
	                response(parseWikiDataResult(jsonObj));
	            };
	            SisterSite.ajaxSisterSiteSearch(ajaxUrl, ajaxData, ajaxSuccess);
	        },
	        // eslint-disable-next-line object-shorthand
	        select: function(event, ui) {
	            $("#input-wikidata-value").val(ui.item.id);
	            updateLinkFunction("", ui.item.id);
	        }
	    }).data("ui-autocomplete")._renderItem = function(ul, item) {
	        var label = `${mw.html.escape(item.label)} <small>${mw.html.escape(item.id)}</small>`;
	        if (item.description) {
	            label += `<br /><small>${mw.html.escape(item.description)}</small>`;
	        }
	        return $("<li>").data('ui-autocomplete-item', item).append($("<a>").html(label)).appendTo(ul);
	    };
	};

	const setupWikipediaAutocomplete = ( SisterSite, form, updateLinkFunction ) => {
	    var wikipediaSiteData = {
	        apiUrl: SisterSite.API_WIKIPEDIA,
	        selector: $('#input-wikipedia', form),
	        form,
	        ajaxData: {
	            namespace: 0
	        },
	        updateLinkFunction
	    };
	    SisterSite.initializeSisterSiteAutocomplete(wikipediaSiteData);
	};


	const setupCommonsAutocomplete = ( SisterSite, form, updateLinkFunction ) => {
	    var commonsSiteData = {
	        apiUrl: SisterSite.API_COMMONS,
	        selector: $('#input-image', form),
	        form,
	        ajaxData: {
	            namespace: 6
	        },
	        updateLinkFunction
	    };
	    SisterSite.initializeSisterSiteAutocomplete(commonsSiteData);
	};

	autocompletes = ( SisterSite, form, wikidataLink, wikipediaLink, commonsLink ) => {
	    setupWikidataAutocomplete( SisterSite, form, wikidataLink );
	    setupWikipediaAutocomplete( SisterSite, form, wikipediaLink );
	    setupCommonsAutocomplete( SisterSite, form, commonsLink );
	};
	return autocompletes;
}

var html;
var hasRequiredHtml;

function requireHtml () {
	if (hasRequiredHtml) return html;
	hasRequiredHtml = 1;
	html = ( translate ) => `<div id="div_wikidata" class="editor-row">
    <div class="editor-label-col"><label for="input-wikidata-label">Wikidata</label></div>
    <div>
        <input type="text" class="editor-partialwidth" id="input-wikidata-label">
        <input type="hidden" id="input-wikidata-value">
        <a href="javascript:" id="wp-wd"
            title="${translate( 'wpWd' )}"
            style="display:none"><small>&#160;WP</small></a>
        <span id="wikidata-value-display-container" style="display:none">
            <small>
            &#160;<span id="wikidata-value-link"></span>
            &#160;|&#160;<a href="javascript:"
                id="wikidata-remove"
                title="${translate( 'wikidataRemoveTitle' )}">${translate( 'wikidataRemoveLabel' )}</a>
            </small>
        </span>
    </div>
</div>
<div id="div_wikidata_update" style="display: none">
    <div class="editor-label-col">&#160;</div>
    <div>
        <span class="wikidata-update"></span>
        <a href="javascript:" id="wikidata-shared">${translate( 'syncWikidata' )}</a>
        <small>&nbsp;<a href="javascript:"
            title="${translate( 'syncWikidataTitle' )}"
            class="listing-tooltip"
            id="wikidata-shared-quick">${translate( 'syncWikidataLabel' )}</a>
        </small>
    </div>
</div>
<div id="div_wikipedia" class="editor-row">
    <div class="editor-label-col">
        <label for="input-wikipedia">Wikipedia<span class="wikidata-update"></span></label>
    </div>
    <div>
        <input type="text" class="editor-partialwidth" id="input-wikipedia">
        <span id="wikipedia-value-display-container" style="display:none">
            <small>&#160;<span id="wikipedia-value-link"></span></small>
        </span>
    </div>
</div>
<div id="div_image" class="editor-row">
    <div class="editor-label-col">
        <label for="input-image">${translate( 'image' )}<span class="wikidata-update"></span></label>
    </div>
    <div>
        <input type="text" class="editor-partialwidth" id="input-image">
        <span id="image-value-display-container" style="display:none">
            <small>&#160;<span id="image-value-link"></span></small>
        </span>
    </div>
</div>`;
	return html;
}

var ui;
var hasRequiredUi;

function requireUi () {
	if (hasRequiredUi) return ui;
	hasRequiredUi = 1;
	const updateWikidataInputLabel = ( label ) => {
	    if (label === null) {
	        label = "";
	    }
	    $("#input-wikidata-label").val(label);
	};

	const wikidataRemove = function(form) {
	    $("#input-wikidata-value", form).val("");
	    $("#input-wikidata-label", form).val("");
	    $("#wikidata-value-display-container", form).hide();
	    $('#div_wikidata_update', form).hide();
	};

	const sisterSiteLinkDisplay = function(siteLinkData, form, translate) {
	    const value = $(siteLinkData.inputSelector, form).val();
	    const placeholderWD = $(siteLinkData.inputSelector, form).attr('placeholder');
	    const placeholderDef = translate( `placeholder-${siteLinkData.inputSelector.substring(7)}` ); //skip #input-
	    if ( !placeholderWD || !value && (placeholderDef == placeholderWD) ) {
	        $(siteLinkData.containerSelector, form).hide();
	    } else {
	        const link = $("<a />", {
	            target: "_new",
	            href: siteLinkData.href,
	            title: siteLinkData.linkTitle,
	            text: siteLinkData.linkTitle
	        });
	        $(siteLinkData.linkContainerSelector, form).html(link);
	        $(siteLinkData.containerSelector, form).show();
	    }
	};

	const updateFieldIfNotNull = function(selector, value, placeholderBool) {
	    if ( value !== null ) {
	        if ( placeholderBool !== true ) {
	            $(selector).val(value);
	        } else {
	            $(selector).val('').attr('placeholder', value).attr('disabled', true);
	        }
	    }
	};

	const setWikidataInputFields = ( wikidataID ) => {
	    $("#input-wikidata-value").val(wikidataID);
	    $("#input-wikidata-label").val(wikidataID);
	};

	const showWikidataFields = () => {
	    $('#div_wikidata_update').show();
	    $('#wikidata-remove').show();
	    $('#input-wikidata-label').prop('disabled', false);
	};

	const hideWikidataFields = () => {
	    $('#div_wikidata_update').hide();
	    $('#wikidata-remove').hide();
	    $('#input-wikidata-label').prop('disabled', true);
	};

	ui =  {
	    setWikidataInputFields,
	    showWikidataFields,
	    hideWikidataFields,
	    updateFieldIfNotNull,
	    sisterSiteLinkDisplay,
	    wikidataRemove,
	    updateWikidataInputLabel
	};
	return ui;
}

var SisterSite;
var hasRequiredSisterSite;

function requireSisterSite () {
	if (hasRequiredSisterSite) return SisterSite;
	hasRequiredSisterSite = 1;
	const { WIKIPEDIA_URL, WIKIDATA_URL, COMMONS_URL,
	    LANG,
	    WIKIDATA_SITELINK_WIKIPEDIA } = globalConfig;
	SisterSite = function( Config ) {
	    const { WIKIDATAID } = Config;
	    var API_WIKIDATA = `${WIKIDATA_URL}/w/api.php`;
	    var API_WIKIPEDIA = `${WIKIPEDIA_URL}/w/api.php`;
	    var API_COMMONS = `${COMMONS_URL}/w/api.php`;
	    var WIKIDATA_PROP_WMURL = 'P143'; // Wikimedia import URL
	    var WIKIDATA_PROP_WMPRJ = 'P4656'; // Wikimedia project source of import

	    var initializeSisterSiteAutocomplete = function(siteData) {
	        var currentValue = $(siteData.selector).val();
	        if (currentValue) {
	            siteData.updateLinkFunction(currentValue, siteData.form);
	        }
	        $(siteData.selector).change(function() {
	            siteData.updateLinkFunction($(siteData.selector).val(), siteData.form);
	        });
	        siteData.selectFunction = function(event, ui) {
	            siteData.updateLinkFunction(ui.item.value, siteData.form);
	        };
	        var ajaxData = siteData.ajaxData;
	        ajaxData.action = 'opensearch';
	        ajaxData.list = 'search';
	        ajaxData.limit = 10;
	        ajaxData.redirects = 'resolve';
	        var parseAjaxResponse = function(jsonObj) {
	            var results = [];
	            var titleResults = $(jsonObj[1]);
	            for (var i=0; i < titleResults.length; i++) {
	                var result = titleResults[i];
	                var valueWithoutFileNamespace = (result.indexOf("File:") != -1) ? result.substring("File:".length) : result;
	                var titleResult = { value: valueWithoutFileNamespace, label: result, description: $(jsonObj[2])[i], link: $(jsonObj[3])[i] };
	                results.push(titleResult);
	            }
	            return results;
	        };
	        _initializeAutocomplete(siteData, ajaxData, parseAjaxResponse);
	    };
	    var _initializeAutocomplete = function(siteData, ajaxData, parseAjaxResponse) {
	        var autocompleteOptions = {
	            // eslint-disable-next-line object-shorthand
	            source: function(request, response) {
	                ajaxData.search = request.term;
	                var ajaxSuccess = function(jsonObj) {
	                    console.log('gpot', jsonObj);
	                    response(parseAjaxResponse(jsonObj));
	                };
	                console.log('do ajaxData', siteData.apiUrl, ajaxData, ajaxSuccess);
	                ajaxSisterSiteSearch(siteData.apiUrl, ajaxData, ajaxSuccess);
	            }
	        };
	        if (siteData.selectFunction) {
	            autocompleteOptions.select = siteData.selectFunction;
	        }
	        siteData.selector.autocomplete(autocompleteOptions);
	    };
	    // perform an ajax query of a sister site
	    const ajaxSisterSiteSearch = function(ajaxUrl, ajaxData, ajaxSuccess = ( json ) => json ) {
	        return $.ajax({
	            url: ajaxUrl,
	            data: Object.assign( ajaxData, {
	                format: 'json',
	                origin: '*'
	            } )
	        }).then( ajaxSuccess );
	    };
	    // parse the wikidata "claim" object from the wikidata response
	    var wikidataClaim = function(jsonObj, value, property, guidBool) {
	        var entity = _wikidataEntity(jsonObj, value);
	        if (!entity || !entity.claims || !entity.claims[property]) {
	            return null;
	        }
	        var propertyObj = entity.claims[property];
	        if (!propertyObj || propertyObj.length < 1 || !propertyObj[0].mainsnak || !propertyObj[0].mainsnak.datavalue) {
	            return null;
	        }
	        var index = 0;
	        if( propertyObj[index].mainsnak.datavalue.type === "monolingualtext" ) { // have to select correct language, Wikidata sends all despite specifying
	            while( propertyObj[index].mainsnak.datavalue.value.language !== LANG ) {
	                index = index + 1;
	                if( !(propertyObj[index]) ) { return null; } // if we run out of langs and none of them matched
	            }
	            if (guidBool === true) { return propertyObj[index].id }
	            return propertyObj[index].mainsnak.datavalue.value.text;
	        }
	        if (guidBool === true) { return propertyObj[index].id }
	        return propertyObj[index].mainsnak.datavalue.value;
	    };
	    // parse the wikidata "entity" object from the wikidata response
	    var _wikidataEntity = function(jsonObj, value) {
	        if (!jsonObj || !jsonObj.entities || !jsonObj.entities[value]) {
	            return null;
	        }
	        return jsonObj.entities[value];
	    };
	    // parse the wikidata display label from the wikidata response
	    var wikidataLabel = function(jsonObj, value) {
	        var entityObj = _wikidataEntity(jsonObj, value);
	        if (!entityObj || !entityObj.labels || !entityObj.labels.en) {
	            return null;
	        }
	        return entityObj.labels.en.value;
	    };
	    // parse the wikipedia link from the wikidata response
	    var wikidataWikipedia = function(jsonObj, value) {
	        var entityObj = _wikidataEntity(jsonObj, value);
	        if (!entityObj || !entityObj.sitelinks || !entityObj.sitelinks[WIKIDATA_SITELINK_WIKIPEDIA] || !entityObj.sitelinks[WIKIDATA_SITELINK_WIKIPEDIA].title) {
	            return null;
	        }
	        return entityObj.sitelinks[WIKIDATA_SITELINK_WIKIPEDIA].title;
	    };

	    var wikipediaWikidata = function(jsonObj) {
	        if (!jsonObj || !jsonObj.query || jsonObj.query.pageids[0] == "-1" ) { // wikipedia returns -1 pageid when page is not found
	            return null;
	        }
	        var pageID = jsonObj.query.pageids[0];
	        return jsonObj['query']['pages'][pageID]['pageprops']['wikibase_item'];
	    };
	    var sendToWikidata = function(prop, value, snaktype) {
	        var ajaxData = {
	            action: 'wbcreateclaim',
	            entity: $('#input-wikidata-value').val(),
	            property: prop,
	            snaktype,
	            value,
	            format: 'json',
	        };
	        var ajaxSuccess = function(jsonObj) {
	            referenceWikidata(jsonObj);
	        };
	        var api = new mw.ForeignApi( API_WIKIDATA );
	        api.postWithToken( 'csrf', ajaxData, {success: ajaxSuccess, async: false} ); // async disabled because otherwise get edit conflicts with multiple changes submitted at once
	    };
	    var removeFromWikidata = function(guidObj) {
	        var ajaxData = {
	            action: 'wbremoveclaims',
	            claim: guidObj,
	        };
	        var api = new mw.ForeignApi( API_WIKIDATA );
	        api.postWithToken( 'csrf', ajaxData, { async: false } );
	    };
	    var changeOnWikidata = function(guidObj, prop, value, snaktype) {
	        var ajaxData = {
	            action: 'wbsetclaimvalue',
	            claim: guidObj,
	            snaktype,
	            value
	        };
	        var ajaxSuccess = function(jsonObj) {
	            if( jsonObj.claim ) {
	                if( !(jsonObj.claim.references) ) { // if no references, add imported from
	                    referenceWikidata(jsonObj);
	                }
	                else if ( jsonObj.claim.references.length === 1 ) { // skip if >1 reference; too complex to automatically set
	                    var acceptedProps = [WIKIDATA_PROP_WMURL, WIKIDATA_PROP_WMPRJ]; // properties relating to Wikimedia import only
	                    var diff = $(jsonObj.claim.references[0]['snaks-order']).not(acceptedProps).get(); // x-compatible method for diff on arrays, from https://stackoverflow.com/q/1187518
	                    if( diff.length === 0 ) { // if the set of present properties is a subset of the set of acceptable properties
	                        unreferenceWikidata(jsonObj.claim.id, jsonObj.claim.references[0].hash); // then remove the current reference
	                        referenceWikidata(jsonObj); // and add imported from
	                    }
	                }
	            }
	        };
	        var api = new mw.ForeignApi( API_WIKIDATA );
	        api.postWithToken( 'csrf', ajaxData, {success: ajaxSuccess, async: false} );
	    };
	    var referenceWikidata = function(jsonObj) {
	        var revUrl = `https:${mw.config.get('wgServer')}${mw.config.get('wgArticlePath').replace('$1', '')}${mw.config.get('wgPageName')}?oldid=${mw.config.get('wgCurRevisionId')}`; // surprising that there is no API call for this
	        var ajaxData = {
	            action: 'wbsetreference',
	            statement: jsonObj.claim.id,
	            snaks: `{"${WIKIDATA_PROP_WMURL}":[{"snaktype":"value","property":"${WIKIDATA_PROP_WMURL}","datavalue":{"type":"wikibase-entityid","value":{"entity-type":"item","numeric-id":"${WIKIDATAID}"}}}],` +
	                `"${WIKIDATA_PROP_WMPRJ}": [{"snaktype":"value","property":"${WIKIDATA_PROP_WMPRJ}","datavalue":{"type":"string","value":"${revUrl}"}}]}`,
	        };
	        var api = new mw.ForeignApi( API_WIKIDATA );
	        api.postWithToken( 'csrf', ajaxData, { async: false } );
	    };
	    var unreferenceWikidata = function(statement, references) {
	        var ajaxData = {
	            action: 'wbremovereferences',
	            statement,
	            references
	        };
	        var api = new mw.ForeignApi( API_WIKIDATA );
	        api.postWithToken( 'csrf', ajaxData, { async: false } );
	    };
	    // expose public members
	    return {
	        API_WIKIDATA,
	        API_WIKIPEDIA,
	        API_COMMONS,
	        initializeSisterSiteAutocomplete,
	        ajaxSisterSiteSearch,
	        wikidataClaim,
	        wikidataWikipedia,
	        wikidataLabel,
	        wikipediaWikidata,
	        sendToWikidata,
	        removeFromWikidata,
	        changeOnWikidata,
	        referenceWikidata,
	        unreferenceWikidata
	    };
	};
	return SisterSite;
}

var render;
var hasRequiredRender;

function requireRender () {
	if (hasRequiredRender) return render;
	hasRequiredRender = 1;
	const autocompletes = requireAutocompletes();
	const trimDecimal = requireTrimDecimal();
	const dialog = requireDialogs();
	const parseDMS = parseDMS_1;
	const { iata } = requireTemplates();
	const htmlSisterSites = requireHtml();
	const { WIKIPEDIA_URL, WIKIDATA_URL, COMMONS_URL, LANG } = globalConfig;
	const listingEditorSync = requireListingEditorSync();
	const {
	    wikidataRemove,
	    setWikidataInputFields,
	    showWikidataFields,
	    hideWikidataFields,
	    updateFieldIfNotNull,
	    updateWikidataInputLabel, sisterSiteLinkDisplay
	} = requireUi();

	const makeSubmitFunction = function(SisterSite, Config, commonsLink, wikipediaLink) {
	    return () => {
	        const { WIKIDATA_CLAIMS, LISTING_TEMPLATES } = Config;
	        const { API_WIKIDATA, sendToWikidata, changeOnWikidata,
	            removeFromWikidata, ajaxSisterSiteSearch } = SisterSite;

	        listingEditorSync.$element().find('input[id]:radio:checked').each(function () {
	            var label = $(`label[for="${$(this).attr('id')}"]`);
	            var syncedValue = label.text().split('\n');
	            var field = JSON.parse($(this).parents('.choose-row').find('#has-json > input:hidden:not(:radio)').val()); // not radio needed, remotely_synced values use hidden radio buttons
	            var editorField = [];
	            for( var i = 0; i < field.fields.length; i++ ) { editorField[i] = `#${LISTING_TEMPLATES.listing[field.fields[i]].id}`; }
	            var guidObj = $(this).parents('.choose-row').find('#has-guid > input:hidden:not(:radio)').val();

	            if ( field.p === WIKIDATA_CLAIMS.coords.p ) { //first latitude, then longitude
	                var DDValue = [];
	                for ( i = 0; i < editorField.length; i++) {
	                    DDValue[i] = syncedValue[i] ?
	                        trimDecimal(parseDMS(syncedValue[i]), 6) : '';
	                    updateFieldIfNotNull(editorField[i], syncedValue[i], field.remotely_sync);
	                }
	                // TODO: make the find on map link work for placeholder coords
	                if( (DDValue[0]==='') && (DDValue[1]==='') ) {
	                    syncedValue = ''; // dummy empty value to removeFromWikidata
	                } else if( !isNaN(DDValue[0]) && !isNaN(DDValue[1]) ){
	                    var precision = Math.min(DDValue[0].toString().replace(/\d/g, "0").replace(/$/, "1"), DDValue[1].toString().replace(/\d/g, "0").replace(/$/, "1"));
	                    syncedValue = `{ "latitude": ${DDValue[0]}, "longitude": ${DDValue[1]}, "precision": ${precision} }`;
	                }
	            } else {
	                syncedValue = syncedValue[0]; // remove dummy newline
	                updateFieldIfNotNull(editorField[0], syncedValue, field.remotely_sync);
	                //After the sync with WD force the link to the WP & Common resource to be hidden as naturally happen in quickUpdateWikidataSharedFields
	                //a nice alternative is to update the links in both functions
	                if( $(this).attr('name') == 'wikipedia' ) {
	                    wikipediaLink(syncedValue, $("#listing-editor"));
	                }
	                if( field.p === WIKIDATA_CLAIMS.image.p ) {
	                    commonsLink(syncedValue, $("#listing-editor"));
	                }
	                if( syncedValue !== '') {
	                    if( field.p === WIKIDATA_CLAIMS.email.p ) {
	                        syncedValue = `mailto:${syncedValue}`;
	                    }
	                    syncedValue = `"${syncedValue}"`;
	                }
	            }

	            if( (field.doNotUpload !== true) && ($(this).attr('id').search(/-wd$/) === -1) ) { // -1: regex not found
	                ajaxSisterSiteSearch(
	                    API_WIKIDATA,
	                    {
	                        action: 'wbgetentities',
	                        ids: field.p,
	                        props: 'datatype',
	                    }
	                ).then( ( jsonObj ) => {
	                     //if ( TODO: add logic for detecting Wikipedia and not doing this test. Otherwise get an error trying to find undefined. Keep in mind that we would in the future call sitelink changing here maybe. Not urgent, error harmless ) { }
	                    /*else*/ if ( jsonObj.entities[field.p].datatype === 'monolingualtext' ) {
	                        syncedValue = `{"text": ${syncedValue}, "language": "${LANG}"}`;
	                    }
	                    if ( guidObj === "null" ) { // no value on Wikidata, string "null" gets saved in hidden field. There should be no cases in which there is no Wikidata item but this string does not equal "null"
	                        if (syncedValue !== '') {
	                            sendToWikidata(field.p , syncedValue, 'value');
	                        }
	                    } else {
	                        if ( syncedValue !== "" ) {
	                            // this is changing, for when guid is not null and neither is the value
	                            // Wikidata silently ignores a request to change a value to its existing value
	                            changeOnWikidata(guidObj, field.p, syncedValue, 'value');
	                        } else if( (field.p !== WIKIDATA_CLAIMS.coords.p) || (DDValue[0] === '' && DDValue[1] === '') ) {
	                            removeFromWikidata(guidObj);
	                        }
	                    }
	                } );
	            }
	        });

	        dialog.close(this);
	    }
	};

	const updateWikidataSharedFields = function(
	    wikidataRecord, SisterSite
	) {
	    const { API_WIKIDATA, ajaxSisterSiteSearch } = SisterSite;

	    return ajaxSisterSiteSearch(
	        API_WIKIDATA,
	        {
	            action: 'wbgetentities',
	            ids: wikidataRecord,
	            languages: LANG
	        }
	    );
	};

	const launchSyncDialog = function (jsonObj, wikidataRecord, SisterSite, Config, translate, commonsLink, wikipediaLink) {
	    const $syncDialogElement = listingEditorSync.init(
	        SisterSite, Config, translate, jsonObj, wikidataRecord
	    );
	    const submitFunction = makeSubmitFunction( SisterSite, Config, commonsLink, wikipediaLink );
	    dialog.open($syncDialogElement, {
	        title: translate( 'syncTitle' ),
	        dialogClass: 'listing-editor-dialog listing-editor-dialog--wikidata-shared',

	        buttons: [
	            {
	                text: translate( 'submit' ),
	                click: submitFunction,
	            },
	            {
	                text: translate( 'cancel' ),
	                // eslint-disable-next-line object-shorthand
	                click: function() {
	                    dialog.close(this);
	                }
	            },
	        ],
	        // eslint-disable-next-line object-shorthand
	        open: function() {
	            hideWikidataFields();
	        },
	        // eslint-disable-next-line object-shorthand
	        close: function() {
	            showWikidataFields();
	            //listingEditorSync.destroy();
	            document.getElementById("listing-editor-sync").outerHTML = ""; // delete the dialog. Direct DOM manipulation so the model gets updated. This is to avoid issues with subsequent dialogs no longer matching labels with inputs because IDs are already in use.
	        }
	    });
	    if($syncDialogElement.find('.sync_label').length === 0) { // if no choices, close the dialog and display a message
	        submitFunction();
	        listingEditorSync.destroy();
	        alert( translate( 'wikidataSharedMatch' ) );
	    }

	    $syncDialogElement.find('.clear').on( 'click',  function() {
	        $syncDialogElement.find('input:radio:not([id]):enabled').prop('checked', true);
	    });
	    $syncDialogElement.find('.syncSelect').on( 'click',  function() {
	        const field = $(this).attr('name'); // wv or wd
	        $syncDialogElement.find('input[type=radio]').prop('checked', false);
	        $syncDialogElement.find(`input[id$=${field}]`).prop('checked', true);
	    });
	    $syncDialogElement.find('#autoSelect').on( 'click',  function() { // auto select non-empty values
	        $syncDialogElement.find('.choose-row').each(function () {
	            var WD_value = $(this).find('label:first').text().trim().length;
	            var WV_value = $(this).find('label:last').text().trim().length;
	            $(this).find('input[type="radio"]:eq(1)').prop('checked', true); // init with no preferred value
	            if (WD_value) {
	                if (!WV_value) {
	                    $(this).find('input[type="radio"]:first').prop('checked', true); //if WD label has text while WV don't, select WD
	                }
	            } else if (WV_value) {
	                $(this).find('input[type="radio"]:last').prop('checked', true); //if WD label has no text while WV do, select WV
	            }
	        });
	    });
	};

	const getWikidataFromWikipedia = function(titles, SisterSite) {
	    const { API_WIKIPEDIA, ajaxSisterSiteSearch, wikipediaWikidata } = SisterSite;
	    return ajaxSisterSiteSearch(
	        API_WIKIPEDIA,
	        {
	            action: 'query',
	            prop: 'pageprops',
	            ppprop: 'wikibase_item',
	            indexpageids: 1,
	            titles
	        }
	    ).then( ( jsonObj ) => wikipediaWikidata(jsonObj) );
	};

	const makeWikidataLink = ( translate ) => {
	    return function(form, value) {
	        const link = $("<a />", {
	            target: "_new",
	            href: `${WIKIDATA_URL}/wiki/${mw.util.wikiUrlencode(value)}`,
	            title: translate( 'viewWikidataPage' ),
	            text: value
	        });
	        $("#wikidata-value-link", form).html(link);
	        $("#wikidata-value-display-container", form).show();
	        $('#div_wikidata_update', form).show();
	        const $listingEditorSync = listingEditorSync.$element();
	        if ( $listingEditorSync.prev().find(".ui-dialog-title").length ) {
	            $listingEditorSync.prev()
	                .find(".ui-dialog-title")
	                .append( ' &mdash; ' )
	                .append(link.clone());
	        } // add to title of Wikidata sync dialog, if it is open
	    };
	};

	const makeWikipediaLink = ( translate ) => {
	    return function(value, form) {
	        const wikipediaSiteLinkData = {
	            inputSelector: '#input-wikipedia',
	            containerSelector: '#wikipedia-value-display-container',
	            linkContainerSelector: '#wikipedia-value-link',
	            href: `${WIKIPEDIA_URL}/wiki/${mw.util.wikiUrlencode(value)}`,
	            linkTitle: translate( 'viewWikipediaPage' )
	        };
	        sisterSiteLinkDisplay(wikipediaSiteLinkData, form, translate);
	        $("#wp-wd", form).show();
	        if ( value === '' ) {
	            $("#wp-wd").hide();
	        }
	    };
	};

	const makeCommonsLink = ( translate ) => {
	    const commonsLink = function(value, form) {
	        var commonsSiteLinkData = {
	            inputSelector: '#input-image',
	            containerSelector: '#image-value-display-container',
	            linkContainerSelector: '#image-value-link',
	            href: `${COMMONS_URL}/wiki/${mw.util.wikiUrlencode(`File:${value}`)}`,
	            linkTitle: translate( 'viewCommonsPage' )
	        };
	        sisterSiteLinkDisplay(commonsSiteLinkData, form, translate);
	    };
	    return commonsLink;
	};

	const quickUpdateWikidataSharedFields = function(wikidataRecord, SisterSite, Config, translate) {
	    const { API_WIKIDATA, wikidataClaim, wikidataWikipedia,
	        ajaxSisterSiteSearch } = SisterSite;
	    const { WIKIDATA_CLAIMS, LISTING_TEMPLATES } = Config;
	    const ajaxData = {
	        action: 'wbgetentities',
	        ids: wikidataRecord,
	        languages: LANG
	    };
	    const ajaxSuccess = function (jsonObj) {
	        let msg = '';
	        const res = [];
	        for (let key in WIKIDATA_CLAIMS) {
	            res[key] = wikidataClaim(jsonObj, wikidataRecord, WIKIDATA_CLAIMS[key].p);
	            if (res[key]) {
	                if (key === 'coords') { //WD coords already stored in DD notation; no need to apply any conversion
	                    res[key].latitude = trimDecimal(res[key].latitude, 6);
	                    res[key].longitude = trimDecimal(res[key].longitude, 6);
	                    msg += `\n${WIKIDATA_CLAIMS[key].label}: ${res[key].latitude} ${res[key].longitude}`;
	                } else if (key === 'iata') {
	                    msg += `\n${WIKIDATA_CLAIMS[key].label}: ${res[key]}`;
	                    res[key] = iata.replace( '%s', res[key] );
	                } else if (key === 'email') {
	                    res[key] = res[key].replace('mailto:', '');
	                    msg += `\n${WIKIDATA_CLAIMS[key].label}: ${res[key]}`;
	                } else {
	                    msg += `\n${WIKIDATA_CLAIMS[key].label}: ${res[key]}`;
	                }
	            }
	        }
	        const wikipedia = wikidataWikipedia(jsonObj, wikidataRecord);
	        if (wikipedia) {
	            msg += `\n${translate( 'sharedWikipedia' )}: ${wikipedia}`;
	        }

	        if (msg) {
	            const result = {
	                wikipedia
	            };
	            if ( confirm( `${translate( 'wikidataShared' )}\n${msg}`) ) {
	                for (let key in res) {
	                    if (res[key]) {
	                        var editorField = [];
	                        for( var i = 0; i < WIKIDATA_CLAIMS[key].fields.length; i++ ) {
	                            editorField[i] = `#${LISTING_TEMPLATES.listing[WIKIDATA_CLAIMS[key].fields[i]].id}`;
	                        }

	                        if ( (key !== 'iata') || ($('#input-alt').val() === '') ||
	                            (/^IATA: ...$/.test($('#input-alt').val())) ) {
	                            if (key === 'coords') {
	                                updateFieldIfNotNull(editorField[0], res[key].latitude, WIKIDATA_CLAIMS[key].remotely_sync);
	                                updateFieldIfNotNull(editorField[1], res[key].longitude, WIKIDATA_CLAIMS[key].remotely_sync);
	                            }  else {
	                                updateFieldIfNotNull(editorField[0], res[key], WIKIDATA_CLAIMS[key].remotely_sync);
	                                if (key === 'image') {
	                                    result.commons = res[ key ];
	                                }
	                            }
	                        }
	                    }
	                }
	                updateFieldIfNotNull('#input-wikipedia', wikipedia, true);
	                return result;
	            }
	        }
	        return false;
	    };
	    return ajaxSisterSiteSearch(API_WIKIDATA, ajaxData, ajaxSuccess);
	};

	const wikidataLookup = function(ids, SisterSite) {
	    const {
	        API_WIKIDATA,
	        ajaxSisterSiteSearch,
	        wikidataLabel
	    } = SisterSite;
	    // get the display value for the pre-existing wikidata record ID
	    return ajaxSisterSiteSearch(
	        API_WIKIDATA,
	        {
	            action: 'wbgetentities',
	            ids,
	            languages: LANG,
	            props: 'labels'
	        }
	    ).then( ( jsonObj ) =>
	        wikidataLabel( jsonObj, ids )
	    );
	};

	render = ( Config, translate, listingTemplateAsMap ) => {
	    const SisterSite = requireSisterSite()( Config );
	    const wikidataLink = makeWikidataLink( translate );
	    const wikipediaLink = makeWikipediaLink( translate );
	    const commonsLink = makeCommonsLink( translate );

	    return ( form ) => {
	        const div = document.createElement( 'div' );
	        div.innerHTML = htmlSisterSites( translate );
	        form[ 0 ].querySelector( 'sistersites' ).replaceWith(div);
	        ( () => {
	            const { wikipedia, image, wikidata } = listingTemplateAsMap;
	            $( '#input-wikipedia', form ).val( wikipedia );
	            $( '#input-wikidata-value', form ).val( wikidata );
	            $( '#input-wikidata-label', form ).val( wikidata );
	            $( '#input-image', form ).val( image );
	        } )();

	        // get the display value for the pre-existing wikidata record ID
	        const value = $("#input-wikidata-value", form).val();
	        if (value) {
	            wikidataLink(form, value);
	            wikidataLookup( value, SisterSite ).then( ( label ) => {
	                updateWikidataInputLabel( label );
	            } );
	        }
	        $('#wikidata-shared-quick', form).on( 'click', function() {
	            var wikidataRecord = $("#input-wikidata-value", form).val();
	            quickUpdateWikidataSharedFields(wikidataRecord, SisterSite, Config, translate).then( ( { wikipedia, commons } ) => {
	                if ( wikipedia || commons ) {
	                    if (wikipedia) {
	                        wikipediaLink(wikipedia);
	                    }
	                    if ( commons ) {
	                        commonsLink( commons );
	                    }
	                } else {
	                    alert( translate( 'wikidataSharedNotFound' ) );
	                }
	            } );
	        });

	        $('#wikidata-shared', form).on( 'click', function() {
	            const wikidataRecord = $("#input-wikidata-value", form).val();
	            updateWikidataSharedFields(
	                wikidataRecord, SisterSite
	            ).then(( jsonObj ) => {
	                wikidataLink("", $("#input-wikidata-value").val()); // called to append the Wikidata link to the dialog title
	                launchSyncDialog(
	                    jsonObj, wikidataRecord, SisterSite, Config, translate, commonsLink, wikipediaLink
	                );
	            });
	        });

	        // add a listener to the "remove" button so that links can be deleted
	        $('#wikidata-remove', form).on( 'click', function() {
	            wikidataRemove(form);
	        });
	        $('#input-wikidata-label', form).change(function() {
	            if (!$(this).val()) {
	                wikidataRemove(form);
	            }
	        });
	        $('#wp-wd', form).on( 'click', function() {
	            getWikidataFromWikipedia(
	                $("#input-wikipedia", form).val(),
	                SisterSite
	            ).then( ( wikidataID ) => {
	                if( wikidataID ) {
	                    setWikidataInputFields( wikidataID );
	                    wikidataLink(form, wikidataID);
	                }
	            });
	        });
	        autocompletes(
	            SisterSite,
	            form,
	            wikidataLink,
	            wikipediaLink,
	            commonsLink
	        );
	    };
	};
	return render;
}

var currentEdit;
var hasRequiredCurrentEdit;

function requireCurrentEdit () {
	if (hasRequiredCurrentEdit) return currentEdit;
	hasRequiredCurrentEdit = 1;
	let sectionText, inlineListing;

	const setInlineListing = ( isInline ) => {
	    inlineListing = isInline;
	};

	const isInlineListing = () => inlineListing;

	const getSectionText = () => sectionText;

	const setSectionText = ( text ) => {
	    sectionText = text;
	    return sectionText;
	};

	currentEdit = {
	    setSectionText,
	    getSectionText,
	    isInlineListing,
	    setInlineListing
	};
	return currentEdit;
}

var isCustomListingType_1;
var hasRequiredIsCustomListingType;

function requireIsCustomListingType () {
	if (hasRequiredIsCustomListingType) return isCustomListingType_1;
	hasRequiredIsCustomListingType = 1;
	const { getConfig } = Config;

	/**
	 * Determine if the specified listing type is a custom type - for example "go"
	 * instead of "see", "do", "listing", etc.
	 */
	const isCustomListingType = function(listingType) {
	    const { LISTING_TEMPLATES } = getConfig();
	    return !(listingType in LISTING_TEMPLATES);
	};

	isCustomListingType_1 = isCustomListingType;
	return isCustomListingType_1;
}

var getListingInfo_1;
var hasRequiredGetListingInfo;

function requireGetListingInfo () {
	if (hasRequiredGetListingInfo) return getListingInfo_1;
	hasRequiredGetListingInfo = 1;
	const isCustomListingType = requireIsCustomListingType();
	const { getConfig } = Config;

	/**
	 * Given a listing type, return the appropriate entry from the
	 * LISTING_TEMPLATES array. This method returns the entry for the default
	 * listing template type if not enty exists for the specified type.
	 */
	const getListingInfo = function(type) {
	    const { DEFAULT_LISTING_TEMPLATE, LISTING_TEMPLATES } = getConfig();
	    return (isCustomListingType(type)) ? LISTING_TEMPLATES[DEFAULT_LISTING_TEMPLATE] : LISTING_TEMPLATES[type];
	};

	getListingInfo_1 = getListingInfo;
	return getListingInfo_1;
}

var listingToStr_1;
var hasRequiredListingToStr;

function requireListingToStr () {
	if (hasRequiredListingToStr) return listingToStr_1;
	hasRequiredListingToStr = 1;
	const isCustomListingType = requireIsCustomListingType();
	const currentEdit = requireCurrentEdit();
	const getListingInfo = requireGetListingInfo();
	const { getConfig } = Config;

	/**
	 * Trim whitespace at the end of a string.
	 */
	const rtrim = function(str) {
	    return str.replace(/\s+$/, '');
	};

	/**
	 * Convert the listing map back to a wiki text string.
	 */
	const listingToStr = function(listing) {
	    const { LISTING_TYPE_PARAMETER,
	        ALLOW_UNRECOGNIZED_PARAMETERS,
	        LISTING_CONTENT_PARAMETER,
	        DEFAULT_LISTING_TEMPLATE } = getConfig();
	    const inlineListing = currentEdit.isInlineListing();
	    var listingType = listing[LISTING_TYPE_PARAMETER];
	    var listingParameters = getListingInfo(listingType);
	    var saveStr = '{{';
	    if( isCustomListingType(listingType) ) { // type parameter specified explicitly only on custom type
	        saveStr += DEFAULT_LISTING_TEMPLATE;
	        saveStr += ` | ${LISTING_TYPE_PARAMETER}=${listingType}`;
	    } else {
	        saveStr += listingType;
	    }
	    if (!inlineListing && listingParameters[LISTING_TYPE_PARAMETER].newline) {
	        saveStr += '\n';
	    }
	    for (var parameter in listingParameters) {
	        var l = listingParameters[parameter];
	        if (parameter === LISTING_TYPE_PARAMETER) {
	            // "type" parameter was handled previously
	            continue;
	        }
	        if (parameter === LISTING_CONTENT_PARAMETER) {
	            // processed last
	            continue;
	        }
	        if (listing[parameter] !== '' || (!l.skipIfEmpty && !inlineListing)) {
	            saveStr += `| ${parameter}=${listing[parameter]}`;
	        }
	        if (!saveStr.match(/\n$/)) {
	            if (!inlineListing && l.newline) {
	                saveStr = `${rtrim(saveStr)}\n`;
	            } else if (!saveStr.match(/ $/)) {
	                saveStr += ' ';
	            }
	        }
	    }
	    if (ALLOW_UNRECOGNIZED_PARAMETERS) {
	        // append any unexpected values
	        for (var key in listing) {
	            if (listingParameters[key]) {
	                // this is a known field
	                continue;
	            }
	            if (listing[key] === '') {
	                // skip unrecognized fields without values
	                continue;
	            }
	            saveStr += `| ${key}=${listing[key]}`;
	            saveStr += (inlineListing) ? ' ' : '\n';
	        }
	    }
	    saveStr += `| ${LISTING_CONTENT_PARAMETER}=${listing[LISTING_CONTENT_PARAMETER]}`;
	    saveStr += (inlineListing || !listingParameters[LISTING_CONTENT_PARAMETER].newline) ? ' ' : '\n';
	    saveStr += '}}';
	    return saveStr;
	};

	listingToStr_1 = listingToStr;
	return listingToStr_1;
}

var mode;
var hasRequiredMode;

function requireMode () {
	if (hasRequiredMode) return mode;
	hasRequiredMode = 1;
	mode = {
	    MODE_ADD: 'add',
	    MODE_EDIT: 'edit'
	};
	return mode;
}

/**
 * Determine whether a listing entry is within a paragraph rather than
 * an entry in a list; inline listings will be formatted slightly
 * differently than entries in lists (no newlines in the template syntax,
 * skip empty fields).
 */

var isInline_1;
var hasRequiredIsInline;

function requireIsInline () {
	if (hasRequiredIsInline) return isInline_1;
	hasRequiredIsInline = 1;
	const isInline = function(entry) {
	    // if the edit link clicked is within a paragraph AND, since
	    // newlines in a listing description will cause the Mediawiki parser
	    // to close an HTML list (thus triggering the "is edit link within a
	    // paragraph" test condition), also verify that the listing is
	    // within the expected listing template span tag and thus hasn't
	    // been incorrectly split due to newlines.
	    return (entry.closest('p').length !== 0 && entry.closest('span.vcard').length !== 0);
	};

	isInline_1 = isInline;
	return isInline_1;
}

/**
 * Given a DOM element, find the nearest editable section (h2 or h3) that
 * it is contained within.
 */

var findSectionHeading_1;
var hasRequiredFindSectionHeading;

function requireFindSectionHeading () {
	if (hasRequiredFindSectionHeading) return findSectionHeading_1;
	hasRequiredFindSectionHeading = 1;
	const findSectionHeading = function(element) {
	    // mw-h3section and mw-h2section can be removed when useparsoid=1 is everywhere.
	    return element.closest('div.mw-h3section, div.mw-h2section, section');
	};

	findSectionHeading_1 = findSectionHeading;
	return findSectionHeading_1;
}

/**
 * Given an editable heading, examine it to determine what section index
 * the heading represents. First heading is 1, second is 2, etc.
 */

var findSectionIndex_1;
var hasRequiredFindSectionIndex;

function requireFindSectionIndex () {
	if (hasRequiredFindSectionIndex) return findSectionIndex_1;
	hasRequiredFindSectionIndex = 1;
	const findSectionIndex = function(heading) {
	    if (heading === undefined) {
	        return 0;
	    }
	    var link = heading.find('.mw-editsection a').attr('href');
	    return (link !== undefined) ? link.split('=').pop() : 0;
	};

	findSectionIndex_1 = findSectionIndex;
	return findSectionIndex_1;
}

var findListingIndex_1;
var hasRequiredFindListingIndex;

function requireFindListingIndex () {
	if (hasRequiredFindListingIndex) return findListingIndex_1;
	hasRequiredFindListingIndex = 1;
	// selector that identifies the edit link as created by the
	// addEditButtons() function
	const EDIT_LINK_SELECTOR = '.vcard-edit-button';

	/**
	 * Given an edit link that was clicked for a listing, determine what index
	 * that listing is within a section. First listing is 0, second is 1, etc.
	 */
	const findListingIndex = function(sectionHeading, clicked) {
	    var count = 0;
	    $(EDIT_LINK_SELECTOR, sectionHeading).each(function() {
	        if (clicked.is($(this))) {
	            return false;
	        }
	        count++;
	    });
	    return count;
	};

	findListingIndex_1 = findListingIndex;
	return findListingIndex_1;
}

var findListingTypeForSection;
var hasRequiredFindListingTypeForSection;

function requireFindListingTypeForSection () {
	if (hasRequiredFindListingTypeForSection) return findListingTypeForSection;
	hasRequiredFindListingTypeForSection = 1;
	findListingTypeForSection = function(entry, sectionToTemplateType, defaultType) {
	    let closestSection = entry.closest('div.mw-h2section, section');
	    while ( closestSection.is( 'section' ) && closestSection.parents( 'section' ).length ) {
	        // check it's the top level section.
	        closestSection = closestSection.parent( 'section' );
	    }
	    const closestHeading = closestSection.find( '.mw-heading2 h2, h2 .mw-headline');
	    const sectionType = closestHeading.attr('id');
	    for (var sectionId in sectionToTemplateType) {
	        if (sectionType == sectionId) {
	            return sectionToTemplateType[sectionId];
	        }
	    }
	    return defaultType;
	};
	return findListingTypeForSection;
}

var getListingTypesRegex_1;
var hasRequiredGetListingTypesRegex;

function requireGetListingTypesRegex () {
	if (hasRequiredGetListingTypesRegex) return getListingTypesRegex_1;
	hasRequiredGetListingTypesRegex = 1;
	const { getConfig } = Config;
	/**
	 * Return a regular expression that can be used to find all listing
	 * template invocations (as configured via the LISTING_TEMPLATES map)
	 * within a section of wikitext. Note that the returned regex simply
	 * matches the start of the template ("{{listing") and not the full
	 * template ("{{listing|key=value|...}}").
	 */
	const getListingTypesRegex = function() {
	    const { LISTING_TEMPLATES, listingTypeRegExp } = getConfig();
	    var regex = [];
	    for (var key in LISTING_TEMPLATES) {
	        regex.push(key);
	    }
	    return new RegExp( listingTypeRegExp.replace( '%s', regex.join( '|' ) ), 'ig' );
	};

	getListingTypesRegex_1 = getListingTypesRegex;
	return getListingTypesRegex_1;
}

var getListingWikitextBraces_1;
var hasRequiredGetListingWikitextBraces;

function requireGetListingWikitextBraces () {
	if (hasRequiredGetListingWikitextBraces) return getListingWikitextBraces_1;
	hasRequiredGetListingWikitextBraces = 1;
	const getListingTypesRegex = requireGetListingTypesRegex();
	const { getSectionText, setSectionText } = requireCurrentEdit();
	/**
	 * Given a listing index, return the full wikitext for that listing
	 * ("{{listing|key=value|...}}"). An index of 0 returns the first listing
	 * template invocation, 1 returns the second, etc.
	 */
	const getListingWikitextBraces = function(listingIndex) {
	    let sectionText = getSectionText();
	    sectionText = setSectionText(
	        sectionText.replace(/[^\S\n]+/g,' ')
	    );
	    // find the listing wikitext that matches the same index as the listing index
	    var listingRegex = getListingTypesRegex();
	    // look through all matches for "{{listing|see|do...}}" within the section
	    // wikitext, returning the nth match, where 'n' is equal to the index of the
	    // edit link that was clicked
	    var listingSyntax, regexResult, listingMatchIndex;

	    for (var i = 0; i <= listingIndex; i++) {
	        regexResult = listingRegex.exec(sectionText);
	        listingMatchIndex = regexResult.index;
	        listingSyntax = regexResult[1];
	    }
	    // listings may contain nested templates, so step through all section
	    // text after the matched text to find MATCHING closing braces
	    // the first two braces are matched by the listing regex and already
	    // captured in the listingSyntax variable
	    var curlyBraceCount = 2;
	    var endPos = sectionText.length;
	    var startPos = listingMatchIndex + listingSyntax.length;
	    var matchFound = false;
	    for (var j = startPos; j < endPos; j++) {
	        if (sectionText[j] === '{') {
	            ++curlyBraceCount;
	        } else if (sectionText[j] === '}') {
	            --curlyBraceCount;
	        }
	        if (curlyBraceCount === 0 && (j + 1) < endPos) {
	            listingSyntax = sectionText.substring(listingMatchIndex, j + 1);
	            matchFound = true;
	            break;
	        }
	    }
	    if (!matchFound) {
	        listingSyntax = sectionText.substring(listingMatchIndex);
	    }
	    return listingSyntax.trim();
	};

	getListingWikitextBraces_1 = getListingWikitextBraces;
	return getListingWikitextBraces_1;
}

var replaceSpecial_1;
var hasRequiredReplaceSpecial;

function requireReplaceSpecial () {
	if (hasRequiredReplaceSpecial) return replaceSpecial_1;
	hasRequiredReplaceSpecial = 1;
	const replaceSpecial = function(str) {
	    return str.replace(/[.?*+^$[\]\\(){}|-]/g, "\\$&");
	};

	replaceSpecial_1 = replaceSpecial;
	return replaceSpecial_1;
}

var findPatternMatch_1;
var hasRequiredFindPatternMatch;

function requireFindPatternMatch () {
	if (hasRequiredFindPatternMatch) return findPatternMatch_1;
	hasRequiredFindPatternMatch = 1;
	const replaceSpecial = requireReplaceSpecial();

	/**
	 * Utility method for finding a matching end pattern for a specified start
	 * pattern, including nesting. The specified value must start with the
	 * start value, otherwise an empty string will be returned.
	 */
	const findPatternMatch = function(value, startPattern, endPattern) {
	    var matchString = '';
	    var startRegex = new RegExp(`^${replaceSpecial(startPattern)}`, 'i');
	    if (startRegex.test(value)) {
	        var endRegex = new RegExp(`^${replaceSpecial(endPattern)}`, 'i');
	        var matchCount = 1;
	        for (var i = startPattern.length; i < value.length; i++) {
	            var remainingValue = value.substr(i);
	            if (startRegex.test(remainingValue)) {
	                matchCount++;
	            } else if (endRegex.test(remainingValue)) {
	                matchCount--;
	            }
	            if (matchCount === 0) {
	                matchString = value.substr(0, i);
	                break;
	            }
	        }
	    }
	    return matchString;
	};

	findPatternMatch_1 = findPatternMatch;
	return findPatternMatch_1;
}

var listingTemplateToParamsArray_1;
var hasRequiredListingTemplateToParamsArray;

function requireListingTemplateToParamsArray () {
	if (hasRequiredListingTemplateToParamsArray) return listingTemplateToParamsArray_1;
	hasRequiredListingTemplateToParamsArray = 1;
	const findPatternMatch = requireFindPatternMatch();

	/**
	 * Split the raw template wikitext into an array of params. The pipe
	 * symbol delimits template params, but this method will also inspect the
	 * content to deal with nested templates or wikilinks that might contain
	 * pipe characters that should not be used as delimiters.
	 */
	const listingTemplateToParamsArray = function(listingTemplateWikiSyntax) {
	    var results = [];
	    var paramValue = '';
	    var pos = 0;
	    while (pos < listingTemplateWikiSyntax.length) {
	        var remainingString = listingTemplateWikiSyntax.substr(pos);
	        // check for a nested template or wikilink
	        var patternMatch = findPatternMatch(remainingString, "{{", "}}");
	        if (patternMatch.length === 0) {
	            patternMatch = findPatternMatch(remainingString, "[[", "]]");
	        }
	        if (patternMatch.length > 0) {
	            paramValue += patternMatch;
	            pos += patternMatch.length;
	        } else if (listingTemplateWikiSyntax.charAt(pos) === '|') {
	            // delimiter - push the previous param and move on to the next
	            results.push(paramValue);
	            paramValue = '';
	            pos++;
	        } else {
	            // append the character to the param value being built
	            paramValue += listingTemplateWikiSyntax.charAt(pos);
	            pos++;
	        }
	    }
	    if (paramValue.length > 0) {
	        // append the last param value
	        results.push(paramValue);
	    }
	    return results;
	};

	listingTemplateToParamsArray_1 = listingTemplateToParamsArray;
	return listingTemplateToParamsArray_1;
}

var replacements_1;
var hasRequiredReplacements;

function requireReplacements () {
	if (hasRequiredReplacements) return replacements_1;
	hasRequiredReplacements = 1;
	let replacements = {};

	const clear = () => {
	    replacements = {};
	};

	const addReplacement = ( rep, comment ) => {
	    replacements[rep] = comment;
	};

	replacements_1 = {
	    replacements,
	    addReplacement,
	    clear
	};
	return replacements_1;
}

var restoreComments_1;
var hasRequiredRestoreComments;

function requireRestoreComments () {
	if (hasRequiredRestoreComments) return restoreComments_1;
	hasRequiredRestoreComments = 1;
	const { replacements, clear } = requireReplacements();

	/**
	 * Search the text provided, and if it contains any text that was
	 * previously stripped out for replacement purposes, restore it.
	 */
	const restoreComments = function(text, resetReplacements) {
	    for (var key in replacements) {
	        var val = replacements[key];
	        text = text.replace(key, val);
	    }
	    if (resetReplacements) {
	        clear();
	    }
	    return text;
	};

	restoreComments_1 = restoreComments;
	return restoreComments_1;
}

var wikiTextToListing_1;
var hasRequiredWikiTextToListing;

function requireWikiTextToListing () {
	if (hasRequiredWikiTextToListing) return wikiTextToListing_1;
	hasRequiredWikiTextToListing = 1;
	const getListingTypesRegex = requireGetListingTypesRegex();
	const listingTemplateToParamsArray = requireListingTemplateToParamsArray();
	const restoreComments = requireRestoreComments();
	const { getConfig } = Config;

	/**
	 * Convert raw wiki listing syntax into a mapping of key-value pairs
	 * corresponding to the listing template parameters.
	 */
	const wikiTextToListing = function(listingTemplateWikiSyntax) {
	    const { LISTING_TYPE_PARAMETER,
	        LISTING_CONTENT_PARAMETER, LISTING_TEMPLATES } = getConfig();
	    var typeRegex = getListingTypesRegex();
	    // convert "{{see" to {{listing|type=see"
	    listingTemplateWikiSyntax = listingTemplateWikiSyntax.replace(typeRegex,`{{listing| ${LISTING_TYPE_PARAMETER}=$2$3`);
	    // remove the trailing braces
	    listingTemplateWikiSyntax = listingTemplateWikiSyntax.slice(0,-2);
	    var listingTemplateAsMap = {};
	    var lastKey;
	    var listParams = listingTemplateToParamsArray(listingTemplateWikiSyntax);
	    for (var j=1; j < listParams.length; j++) {
	        var param = listParams[j];
	        var index = param.indexOf('=');
	        if (index > 0) {
	            // param is of the form key=value
	            var key = param.substr(0, index).trim();
	            var value = param.substr(index+1).trim();
	            listingTemplateAsMap[key] = value;
	            lastKey = key;
	        } else if (lastKey && listingTemplateAsMap[lastKey].length) {
	            // there was a pipe character within a param value, such as
	            // "key=value1|value2", so just append to the previous param
	            listingTemplateAsMap[lastKey] += `|${param}`;
	        }
	    }
	    for (var loopKey1 in listingTemplateAsMap) {
	        // if the template value contains an HTML comment that was
	        // previously converted to a placehold then it needs to be
	        // converted back to a comment so that the placeholder is not
	        // displayed in the edit form
	        listingTemplateAsMap[loopKey1] = restoreComments(listingTemplateAsMap[loopKey1], false);
	    }
	    if (listingTemplateAsMap[LISTING_CONTENT_PARAMETER]) {
	        // convert paragraph tags to newlines so that the content is more
	        // readable in the editor window
	        listingTemplateAsMap[LISTING_CONTENT_PARAMETER] = listingTemplateAsMap[LISTING_CONTENT_PARAMETER].replace(/\s*<p>\s*/g, '\n\n');
	        listingTemplateAsMap[LISTING_CONTENT_PARAMETER] = listingTemplateAsMap[LISTING_CONTENT_PARAMETER].replace(/\s*<br\s*\/?>\s*/g, '\n');
	    }
	    // sanitize the listing type param to match the configured values, so
	    // if the listing contained "Do" it will still match the configured "do"
	    for (var loopKey2 in LISTING_TEMPLATES) {
	        if (listingTemplateAsMap[LISTING_TYPE_PARAMETER].toLowerCase() === loopKey2.toLowerCase()) {
	            listingTemplateAsMap[LISTING_TYPE_PARAMETER] = loopKey2;
	            break;
	        }
	    }
	    return listingTemplateAsMap;
	};

	wikiTextToListing_1 = wikiTextToListing;
	return wikiTextToListing_1;
}

var stripComments_1;
var hasRequiredStripComments;

function requireStripComments () {
	if (hasRequiredStripComments) return stripComments_1;
	hasRequiredStripComments = 1;
	const { addReplacement } = requireReplacements();

	/**
	 * Commented-out listings can result in the wrong listing being edited, so
	 * strip out any comments and replace them with placeholders that can be
	 * restored prior to saving changes.
	 */
	const stripComments = function(text) {
	    var comments = text.match(/<!--[\s\S]*?-->/mig);
	    if (comments !== null ) {
	        for (var i = 0; i < comments.length; i++) {
	            var comment = comments[i];
	            var rep = `<<<COMMENT${i}>>>`;
	            text = text.replace(comment, rep);
	            addReplacement( rep, comment );
	        }
	    }
	    return text;
	};

	stripComments_1 = stripComments;
	return stripComments_1;
}

var validateForm_1;
var hasRequiredValidateForm;

function requireValidateForm () {
	if (hasRequiredValidateForm) return validateForm_1;
	hasRequiredValidateForm = 1;
	const trimDecimal = requireTrimDecimal();

	/**
	 * Logic invoked on form submit to analyze the values entered into the
	 * editor form and to block submission if any fatal errors are found.
	 *
	 * Alerts if validation error found.
	 *
	 * @param {bool} VALIDATE_FORM_CALLBACKS
	 * @param {bool} REPLACE_NEW_LINE_CHARS
	 * @param {bool} APPEND_FULL_STOP_TO_DESCRIPTION
	 * @return {bool} whether validation succeeded.
	 */
	const validateForm = function(
	    VALIDATE_FORM_CALLBACKS,
	    REPLACE_NEW_LINE_CHARS,
	    APPEND_FULL_STOP_TO_DESCRIPTION,
	    translate = () => {}
	) {
	    const coordsError = () => {
	        alert( translate( 'coordinates-error' ) );
	        return false;
	    };

	    var validationFailureMessages = [];
	    for (var i=0; i < VALIDATE_FORM_CALLBACKS.length; i++) {
	        VALIDATE_FORM_CALLBACKS[i](validationFailureMessages);
	    }
	    if (validationFailureMessages.length > 0) {
	        alert(validationFailureMessages.join('\n'));
	        return false;
	    }
	    // newlines in listing content won't render properly in lists, so replace them with <br> tags
	    if ( REPLACE_NEW_LINE_CHARS ) {
	        $('#input-content').val(
	            ($('#input-content').val() || '')
	                .trim().replace(/\n/g, '<br />')
	        );
	    }
	    // add trailing period in content. Note: replace(/(?<!\.)$/, '.') is not supported by IE
	    // Trailing period shall not be added if one of the following char is present: ".", "!" or "?"
	    const $content = $('#input-content');
	    const contentValue = $content.val() || '';
	    if ( APPEND_FULL_STOP_TO_DESCRIPTION && contentValue ) {
	        $content
	            .val(
	                `${contentValue.trim()}.`
	                    .replace(/([.!?])\.+$/, '$1')
	            );
	    }

	    // remove trailing period from price and address block
	    $('#input-price').val(
	        ($('#input-price').val() || '')
	            .trim().replace(/\.$/, '')
	    );
	    $('#input-address').val(
	        ($('#input-address').val() || '')
	            .trim().replace(/\.$/, '')
	    );
	    // in case of decimal format, decimal digits will be limited to 6
	    const latInput = ( $('#input-lat').val() || '' ).trim();
	    const longInput = ( $('#input-long').val() || '' ).trim();
	    if ( latInput && longInput ) {
	        const lat = Number( latInput );
	        const long = Number( longInput );
	        if ( isNaN( lat ) || isNaN( long ) ) {
	            return coordsError();
	        } else {
	            const savedLat = trimDecimal( lat, 6 );
	            const savedLong = trimDecimal( long, 6 );
	            $('#input-lat').val( savedLat );
	            $('#input-long').val( savedLong );
	        }
	    } else if ( latInput && !longInput ) {
	        return coordsError();
	    } else if ( !latInput && longInput ) {
	        return coordsError();
	    }

	    var webRegex = new RegExp('^https?://', 'i');
	    var url = $('#input-url').val();
	    if (!webRegex.test(url) && url !== '') {
	        $('#input-url').val(`http://${url}`);
	    }
	    return true;

	};

	validateForm_1 = validateForm;
	return validateForm_1;
}

var getSectionName_1;
var hasRequiredGetSectionName;

function requireGetSectionName () {
	if (hasRequiredGetSectionName) return getSectionName_1;
	hasRequiredGetSectionName = 1;
	const { getSectionText } = requireCurrentEdit();

	const getSectionName = function() {
	    const sectionText = getSectionText();
	    var HEADING_REGEX = /^=+\s*([^=]+)\s*=+\s*\n/;
	    var result = HEADING_REGEX.exec(sectionText);
	    return (result !== null) ? result[1].trim() : "";
	};

	getSectionName_1 = getSectionName;
	return getSectionName_1;
}

var editSummarySection_1;
var hasRequiredEditSummarySection;

function requireEditSummarySection () {
	if (hasRequiredEditSummarySection) return editSummarySection_1;
	hasRequiredEditSummarySection = 1;
	const getSectionName = requireGetSectionName();

	/**
	 * Begin building the edit summary by trying to find the section name.
	 */
	const editSummarySection = function() {
	    var sectionName = getSectionName();
	    return (sectionName.length) ? `/* ${sectionName} */ ` : "";
	};

	editSummarySection_1 = editSummarySection;
	return editSummarySection_1;
}

var updateSectionTextWithAddedListing_1;
var hasRequiredUpdateSectionTextWithAddedListing;

function requireUpdateSectionTextWithAddedListing () {
	if (hasRequiredUpdateSectionTextWithAddedListing) return updateSectionTextWithAddedListing_1;
	hasRequiredUpdateSectionTextWithAddedListing = 1;
	const { translate } = translate_1;
	const restoreComments = requireRestoreComments();
	const DB_NAME = mw.config.get( 'wgDBname' );
	const { getSectionText, setSectionText } = requireCurrentEdit();

	/**
	 * After the listing has been converted to a string, add additional
	 * processing required for adds (as opposed to edits), returning an
	 * appropriate edit summary string.
	 */
	const updateSectionTextWithAddedListingDefault = function(originalEditSummary, listingWikiText) {
	    let sectionText = getSectionText();
	    var summary = originalEditSummary;
	    summary += translate( 'added' );
	    // add the new listing to the end of the section. if there are
	    // sub-sections, add it prior to the start of the sub-sections.
	    var index = sectionText.indexOf('===');
	    if (index === 0) {
	        index = sectionText.indexOf('====');
	    }
	    if (index > 0) {
	        sectionText = `${sectionText.substr(0, index)}* ${listingWikiText
	                    }\n${sectionText.substr(index)}`;
	    } else {
	        sectionText += `\n* ${listingWikiText}`;
	    }
	    sectionText = restoreComments(sectionText, true);
	    setSectionText( sectionText );
	    return summary;
	};

	const updateSectionTextWithAddedListingIt = function (originalEditSummary, listingWikiText, listing, LISTING_TYPE_PARAMETER) {
	    let sectionText = getSectionText();
	    var summary = originalEditSummary;
	    sectionText = restoreComments(sectionText, true);
	    setSectionText( sectionText );
	    summary += translate( 'added' );
	    //Creo un listing commentato dello stesso tipo di quello che aggiungerò.
	    //Se nella sezione in cui andrò a scrivere troverò questo listing commentato, lo rimpiazzerò col nuovo.
	    var commentedListing = `<!--* {{${listing[LISTING_TYPE_PARAMETER]}\n| nome= | alt= | sito= | email=\n| indirizzo= | lat= | long= | indicazioni=\n| tel= | numero verde= | fax=\n|`;
	    if (listing[LISTING_TYPE_PARAMETER] !== 'sleep') {
	        commentedListing += " orari= | prezzo=\n";
	    } else {
	        commentedListing += " checkin= | checkout= | prezzo=\n";
	    }
	    commentedListing += "| descrizione=\n}}-->\n";
	    var index = 0;
	    var index1 = sectionText.indexOf('===');
	    var index2 = sectionText.indexOf('<!--===');
	    var index3 = sectionText.indexOf('====');
	    var index4 = sectionText.indexOf(`=== ${translate( 'budget' )} ===`);
	    var index5 = sectionText.indexOf(`<!--=== ${translate( 'midrange' )} ===-->`);
	    var index6 = sectionText.indexOf(`=== ${translate( 'splurge' )} ===`);
	    var index7 = sectionText.indexOf(`<!--=== ${translate( 'splurge' )} ===`);
	    var splurgeOffset = 0;
	    if (index7 > 0) {
	        splurgeOffset = 4;
	    }
	    if ( (index1 === 0) && (index2 === 0) ) {
	        index = index3;
	    } else if (index1 === 0) {
	        index = index2;
	    } else if (index2 === 0) {
	        index = index1;
	    } else if (index1 < index2) {
	        index = index1;
	    } else if (index6 > 0) {
	        index = index6;
	    } else {
	        index = index2;
	    }
	    if (index > 0) {
	        var strApp = sectionText.substr(0, index).replace(/(\r\n|\n|\r)/gm," ").trim();
	        if (strApp.substring(strApp.length-5) == '{{-}}') {
	            var indexApp = sectionText.lastIndexOf('{{-}}');
	            sectionText = `${sectionText.substr(0, indexApp).replace(commentedListing,'')}* ${listingWikiText}\n{{-}}${sectionText.substr(indexApp+5)}`;
	        } else {
	            if( (index4 > 0) && (index6 > 0) ) {
	                //Mi assicuro di essere in Dove mangiare/dormire (le uniche divise per fascia di prezzo)
	                if ( index5 > 0) {
	                    //Il primo elemento viene aggiunto nella sottosezione "Prezzi medi" (rimuovendone il commento)
	                    sectionText = `${sectionText.substr(0, index6-splurgeOffset).replace(`<!--=== ${translate( 'midrange' )} ===-->\n${commentedListing}`,`=== ${translate( 'midrange' )} ===\n`)}* ${listingWikiText}\n\n${sectionText.substr(index6-splurgeOffset)}`;
	                } else {
	                    //I successivi elementi vengono accodati nella sottosezione "Prezzi medi" (già priva di commento)
	                    sectionText = `${sectionText.substr(0, index6-splurgeOffset).replace(/\n+$/,'\n')}* ${listingWikiText}\n\n${sectionText.substr(index6-splurgeOffset)}`;
	                }
	            } else {
	                var addbr = '';
	                if( sectionText.substr(index-2, 1).charCodeAt(0) != 10 )
	                    addbr = '\n';
	                sectionText = `${sectionText.substr(0, index-1).replace(commentedListing,'') + addbr}* ${listingWikiText}\n${sectionText.substr(index-1)}`;
	            }
	        }
	    } else {
	        var strApp2 = sectionText.replace(/(\r\n|\n|\r)/gm," ").trim();
	        if (strApp2.substring(strApp2.length-5) == '{{-}}') {
	            var indexApp2 = sectionText.lastIndexOf('{{-}}');
	            sectionText = `${sectionText.substr(0, indexApp2).replace(commentedListing,'')}* ${listingWikiText}\n{{-}}`;
	        } else {
	            sectionText = `${sectionText.replace(commentedListing,'')}\n* ${listingWikiText}`;
	        }
	    }
	    setSectionText( sectionText );
	    return summary;
	};

	const updateSectionTextWithAddedListing = function (originalEditSummary, listingWikiText, listing, LISTING_TYPE_PARAMETER) {
	    switch ( DB_NAME ) {
	        case 'itwikivoyage':
	            return updateSectionTextWithAddedListingIt(originalEditSummary, listingWikiText, listing, LISTING_TYPE_PARAMETER);
	        default:
	            return updateSectionTextWithAddedListingDefault(originalEditSummary, listingWikiText);
	    }
	};

	updateSectionTextWithAddedListing_1 = updateSectionTextWithAddedListing;
	return updateSectionTextWithAddedListing_1;
}

var updateSectionTextWithEditedListing_1;
var hasRequiredUpdateSectionTextWithEditedListing;

function requireUpdateSectionTextWithEditedListing () {
	if (hasRequiredUpdateSectionTextWithEditedListing) return updateSectionTextWithEditedListing_1;
	hasRequiredUpdateSectionTextWithEditedListing = 1;
	const { translate } = translate_1;
	const restoreComments = requireRestoreComments();
	const replaceSpecial = requireReplaceSpecial();
	const { getSectionText, setSectionText } = requireCurrentEdit();
	const { EDITOR_CLOSED_SELECTOR } = requireSelectors();

	/**
	 * After the listing has been converted to a string, add additional
	 * processing required for edits (as opposed to adds), returning an
	 * appropriate edit summary string.
	 */
	const updateSectionTextWithEditedListing = function(editSummary, listingWikiText, listingTemplateWikiSyntax) {
	    let sectionText = getSectionText();
	    // escaping '$&' since in replace regex it means "substitute the whole content"
	    listingWikiText = listingWikiText.replace( /\$&/g, '&#36;&');
	    if ($(EDITOR_CLOSED_SELECTOR).is(':checked')) {
	        listingWikiText = '';
	        editSummary += translate( 'removed' );
	        // TODO: RegEx change to delete the complete row when listing is preceeded by templates showing just icons
	        var listRegex = new RegExp(`(\\n+[\\:\\*\\#]*)?\\s*${replaceSpecial(listingTemplateWikiSyntax)}`);
	        sectionText = sectionText.replace(listRegex, listingWikiText);
	    } else {
	        editSummary += translate( 'updated' );
	        sectionText = sectionText.replace(listingTemplateWikiSyntax, listingWikiText);
	    }
	    sectionText = restoreComments(sectionText, true);
	    sectionText = sectionText.replace( /&#36;/g, '$' ); // '&#36;'->'$' restore on global sectionText var
	    setSectionText( sectionText );
	    return editSummary;
	};

	updateSectionTextWithEditedListing_1 = updateSectionTextWithEditedListing;
	return updateSectionTextWithEditedListing_1;
}

var savePayload_1;
var hasRequiredSavePayload;

function requireSavePayload () {
	if (hasRequiredSavePayload) return savePayload_1;
	hasRequiredSavePayload = 1;
	const api = new mw.Api();

	const savePayload = ( editPayload ) => {
	    const delayedPromise = ( res ) =>
	        new Promise( ( resolve ) => {
	            setTimeout(() => {
	                resolve( res );
	            }, 5000 );
	        } );
	    switch ( window.__save_debug ) {
	        case -1:
	            return delayedPromise( { error: 'error' } );
	        case -2:
	            return delayedPromise( {
	                edit: {
	                    captcha: {
	                        id: 1,
	                        url: 'foo.gif'
	                    }
	                }
	            } );
	        case 0:
	            return delayedPromise( {
	                edit: {
	                    nochange: true,
	                    result: 'Success'
	                }
	            } );
	        case 1:
	            return delayedPromise( {
	                edit: {
	                    result: 'Success'
	                }
	            } );
	        default:
	            return api.postWithToken(
	                "csrf",
	                editPayload
	            )
	    }
	};

	savePayload_1 = savePayload;
	return savePayload_1;
}

var Core_1;
var hasRequiredCore;

function requireCore () {
	if (hasRequiredCore) return Core_1;
	hasRequiredCore = 1;
	const dialog = requireDialogs();
	const IS_LOCALHOST = window.location.host.indexOf( 'localhost' ) > -1;
	const listingEditorSync = requireListingEditorSync();
	const renderSisterSiteApp = requireRender();
	const currentEdit = requireCurrentEdit();
	const { getSectionText, setSectionText } = currentEdit;
	const listingToStr = requireListingToStr();

	var Core = function( Callbacks, Config, PROJECT_CONFIG, translate ) {
	    const {
	        EDITOR_FORM_HTML,
	        LISTING_TYPE_PARAMETER,
	        SECTION_TO_TEMPLATE_TYPE,
	        DEFAULT_LISTING_TEMPLATE,
	        EDITOR_SUMMARY_SELECTOR,
	        EDITOR_MINOR_EDIT_SELECTOR,
	        EDITOR_FORM_SELECTOR,
	        EDITOR_CLOSED_SELECTOR
	    } = Config;

	    var api = new mw.Api();
	    const { MODE_ADD, MODE_EDIT } = requireMode();
	    var SAVE_FORM_SELECTOR = '#progress-dialog';
	    var CAPTCHA_FORM_SELECTOR = '#captcha-dialog';
	    var NATL_CURRENCY_SELECTOR = '#span_natl_currency';
	    var NATL_CURRENCY = [];
	    var CC_SELECTOR = '.input-cc'; // Country calling code
	    var CC = '';
	    var LC = '';

	    /**
	     * Generate the form UI for the listing editor. If editing an existing
	     * listing, pre-populate the form input fields with the existing values.
	     */
	    var createForm = function(mode, listingParameters, listingTemplateAsMap) {
	        var form = $(EDITOR_FORM_HTML);
	        // make sure the select dropdown includes any custom "type" values
	        var listingType = listingTemplateAsMap[LISTING_TYPE_PARAMETER];
	        const $dropdown = $(`#${listingParameters[LISTING_TYPE_PARAMETER].id}`, form);
	        const LISTING_TEMPLATES_OMIT = PROJECT_CONFIG.LISTING_TEMPLATES_OMIT;
	        const SUPPORTED_SECTIONS = PROJECT_CONFIG.SUPPORTED_SECTIONS
	            .filter( ( a ) => !LISTING_TEMPLATES_OMIT.includes( a ) );
	        SUPPORTED_SECTIONS.forEach( ( value ) => {
	            $( '<option>' ).val( value ).text( value ).appendTo( $dropdown );
	        } );
	        if (isCustomListingType(listingType)) {
	            $dropdown.append( $( '<option></option>').attr( {value: listingType }).text( listingType ) );
	        }
	        // populate the empty form with existing values
	        for (var parameter in listingParameters) {
	            var parameterInfo = listingParameters[parameter];
	            if (listingTemplateAsMap[parameter]) {
	                $(`#${parameterInfo.id}`, form).val(listingTemplateAsMap[parameter]);
	            } else if (parameterInfo.hideDivIfEmpty) {
	                $(`#${parameterInfo.hideDivIfEmpty}`, form).hide();
	            }
	        }
	        // Adding national currency symbols
	        var natlCurrency = $(NATL_CURRENCY_SELECTOR, form);
	        if (NATL_CURRENCY.length > 0) {
	            for (i = 0; i < NATL_CURRENCY.length; i++) {
	                natlCurrency.append(`<span class="listing-charinsert" data-for="input-price"> <a href="javascript:">${NATL_CURRENCY[i]}</a></span>`);
	            }
	            natlCurrency.append(' |');
	        } else natlCurrency.hide();
	        // Adding country calling code
	        var phones = $(CC_SELECTOR, form);
	        if (CC !== '' || LC !== '') {
	            phones.each( function() {
	                i = $(this).attr('data-for');
	                if (CC !== '')
	                    $(this).append( `<span class="listing-charinsert" data-for="${i}"><a href="javascript:">${CC} </a></span>` );
	                if (LC !== '')
	                    $(this).append( `<span class="listing-charinsert" data-for="${i}"><a href="javascript:">${LC} </a></span>` );
	            });
	        } else phones.hide();

	        for (var i=0; i < Callbacks.CREATE_FORM_CALLBACKS.length; i++) {
	            Callbacks.CREATE_FORM_CALLBACKS[i](form, mode);
	        }
	        // update SisterSite app values
	        renderSisterSiteApp( Config, translate, listingTemplateAsMap )( form );
	        return form;
	    };

	    var isInline = requireIsInline();

	    var findSectionHeading = requireFindSectionHeading();

	    var findSectionIndex = requireFindSectionIndex();

	    /**
	     * Given an edit link that was clicked for a listing, determine what index
	     * that listing is within a section. First listing is 0, second is 1, etc.
	     */
	    var findListingIndex = requireFindListingIndex();

	    /**
	     * Return the listing template type appropriate for the section that
	     * contains the provided DOM element (example: "see" for "See" sections,
	     * etc). If no matching type is found then the default listing template
	     * type is returned.
	     */
	    const _findListingTypeForSection = requireFindListingTypeForSection();
	    const findListingTypeForSection = function(entry ) {
	        return _findListingTypeForSection( entry, SECTION_TO_TEMPLATE_TYPE, DEFAULT_LISTING_TEMPLATE );
	    };

	    /**
	     * Given a listing index, return the full wikitext for that listing
	     * ("{{listing|key=value|...}}"). An index of 0 returns the first listing
	     * template invocation, 1 returns the second, etc.
	     */
	    var getListingWikitextBraces = requireGetListingWikitextBraces();

	    var wikiTextToListing = requireWikiTextToListing();

	    /**
	     * This method is invoked when an "add" or "edit" listing button is
	     * clicked and will execute an Ajax request to retrieve all of the raw wiki
	     * syntax contained within the specified section. This wiki text will
	     * later be modified via the listing editor and re-submitted as a section
	     * edit.
	     */
	    var initListingEditorDialog = function(mode, clicked) {
	        var listingType;
	        if (mode === MODE_ADD) {
	            listingType = findListingTypeForSection(clicked);
	        }
	        var sectionHeading = findSectionHeading(clicked);
	        var sectionIndex = findSectionIndex(sectionHeading);
	        var listingIndex = (mode === MODE_ADD) ? -1 : findListingIndex(sectionHeading, clicked);
	        currentEdit.setInlineListing( mode === MODE_EDIT && isInline(clicked) );

	        NATL_CURRENCY = [];
	        var dataSel = $( '.countryData' ).attr('data-currency');
	        if ((dataSel !== undefined) && (dataSel !== '')) {
	            NATL_CURRENCY = dataSel.split( ',' ).map( function( item ) {
	                return item.trim();
	            });
	        }
	        CC = '';
	        dataSel = $( '.countryData' ).attr('data-country-calling-code');
	        if ((dataSel !== undefined) && (dataSel !== '')) CC = dataSel;
	        LC = '';
	        dataSel = $( '.countryData' ).attr('data-local-dialing-code');
	        if ((dataSel !== undefined) && (dataSel !== '')) LC = dataSel;

	        api.ajax({
	            prop: 'revisions',
	            format: 'json',
	            formatversion: 2,
	            titles: IS_LOCALHOST ? mw.config.get( 'wgTitle' ) : mw.config.get('wgPageName'),
	            action: 'query',
	            rvprop: 'content',
	            origin: '*',
	            rvsection: sectionIndex
	        }).then(function( data ) {
	            try {
	                setSectionText(
	                    data.query.pages[ 0 ].revisions[ 0 ].content
	                );
	            } catch ( e ) {
	                alert( 'Error occurred loading content for this section.' );
	                return;
	            }
	            openListingEditorDialog(mode, sectionIndex, listingIndex, listingType);
	        }, function( _jqXHR, textStatus, errorThrown ) {
	            alert( `${translate( 'ajaxInitFailure' )}: ${textStatus} ${errorThrown}`);
	        });
	    };

	    /**
	     * This method is called asynchronously after the initListingEditorDialog()
	     * method has retrieved the existing wiki section content that the
	     * listing is being added to (and that contains the listing wiki syntax
	     * when editing).
	     */
	    var openListingEditorDialog = function(mode, sectionNumber, listingIndex, listingType) {
	         setSectionText(
	            stripComments(
	                getSectionText()
	            )
	        );
	        mw.loader.using( ['jquery.ui'], function () {
	            var listingTemplateAsMap, listingTemplateWikiSyntax;
	            if (mode == MODE_ADD) {
	                listingTemplateAsMap = {};
	                listingTemplateAsMap[LISTING_TYPE_PARAMETER] = listingType;
	            } else {
	                listingTemplateWikiSyntax = getListingWikitextBraces(listingIndex);
	                listingTemplateAsMap = wikiTextToListing(listingTemplateWikiSyntax);
	                listingType = listingTemplateAsMap[LISTING_TYPE_PARAMETER];
	            }
	            var listingParameters = getListingInfo(listingType);
	            // if a listing editor dialog is already open, get rid of it
	            if ($(EDITOR_FORM_SELECTOR).length > 0) {
	                dialog.destroy( EDITOR_FORM_SELECTOR );
	            }
	            // if a sync editor dialog is already open, get rid of it
	            listingEditorSync.destroy();
	            var form = $(createForm(mode, listingParameters, listingTemplateAsMap));
	            // modal form - must submit or cancel
	            const dialogTitleSuffix = window.__USE_LISTING_EDITOR_BETA__ ? 'Beta' : '';
	            const buttons = [
	                {
	                    text: '?',
	                    id: 'listing-help',
	                    // eslint-disable-next-line object-shorthand
	                    click: function() {
	                        window.open( translate( 'helpPage' ) );
	                    }
	                },
	                {
	                    text: translate( 'submit' ),
	                    // eslint-disable-next-line object-shorthand
	                    click: function() {
	                        if ($(EDITOR_CLOSED_SELECTOR).is(':checked')) {
	                            // no need to validate the form upon deletion request
	                            formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber);
	                            dialog.close(this);
	                            // if a sync editor dialog is open, get rid of it
	                            listingEditorSync.destroy();
	                        }
	                        else if (
	                            validateForm(
	                                Callbacks.VALIDATE_FORM_CALLBACKS,
	                                PROJECT_CONFIG.REPLACE_NEW_LINE_CHARS,
	                                PROJECT_CONFIG.APPEND_FULL_STOP_TO_DESCRIPTION,
	                                translate
	                            )
	                        ) {
	                            formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber);
	                            dialog.close(this);
	                            // if a sync editor dialog is open, get rid of it
	                            listingEditorSync.destroy();
	                        }
	                    }
	                },
	                {
	                    text: translate( 'cancel' ),
	                    // eslint-disable-next-line object-shorthand
	                    click: function() {
	                        dialog.destroy(this);
	                        // if a sync editor dialog is open, get rid of it
	                        listingEditorSync.destroy();
	                    }
	                }
	            ];
	            let previewTimeout;
	            $( form, 'textarea,input' ).on( 'change', () => {
	                clearInterval( previewTimeout );
	                mw.util.throttle( () => {
	                    previewTimeout = setTimeout( () => {
	                        showPreview(listingTemplateAsMap);
	                    }, 200 );
	                }, 300 )();
	            } );
	            dialog.open(form, {
	                modal: true,
	                title: (mode == MODE_ADD) ?
	                    translate( `addTitle${dialogTitleSuffix}` ) : translate( `editTitle${dialogTitleSuffix}` ),
	                dialogClass: 'listing-editor-dialog',
	                // eslint-disable-next-line object-shorthand
	                create: function() {
	                    // Make button pane
	                    const $dialog = form.parent();
	                    const $btnPane = $( '<div>' )
	                        .addClass( 'ui-dialog-buttonpane ui-widget-content ui-helper-clearfix' )
	                        .appendTo( $dialog );
	                    const $buttonSet = $( '<div>' ).addClass( 'ui-dialog-buttonset' ).appendTo( $btnPane );
	                    buttons.forEach( ( props ) => {
	                        const btn = document.createElement( 'button' );
	                        btn.classList.add( 'cdx-button', 'cdx-button--action-default' );
	                        if ( props.id ) {
	                            btn.id = props.id;
	                        }
	                        if ( props.title ) {
	                            btn.setAttribute( 'title', props.title );
	                        }
	                        if ( props.style ) {
	                            btn.setAttribute( 'style', props.style );
	                        }
	                        btn.textContent = props.text;
	                        btn.addEventListener( 'click', () => {
	                            props.click.apply( form );
	                        } );
	                        $buttonSet.append( btn );
	                    } );
	                    $btnPane.append(`<div class="listing-license">${translate( 'licenseText' )}</div>`);
	                    if ( window.__WIKIVOYAGE_LISTING_EDITOR_VERSION__ ) {
	                        $(
	                            `<span class="listing-license">${translate('listing-editor-version', [ window.__WIKIVOYAGE_LISTING_EDITOR_VERSION__ ])}</span>`
	                        ).appendTo( $btnPane );
	                    }
	                    const bugUrl = 'https://github.com/jdlrobson/Gadget-Workshop/issues';
	                    $( `<span class="listing-license">&nbsp;<a href="${bugUrl}">${translate( 'report-bug' )}</a></span>` )
	                        .appendTo( $btnPane );
	                    $('body').on('dialogclose', EDITOR_FORM_SELECTOR, function() { //if closed with X buttons
	                        // if a sync editor dialog is open, get rid of it
	                        listingEditorSync.destroy();
	                    });
	                }
	            });
	        });
	    };

	    /**
	     * Commented-out listings can result in the wrong listing being edited, so
	     * strip out any comments and replace them with placeholders that can be
	     * restored prior to saving changes.
	     */
	    var stripComments = requireStripComments();

	    /**
	     * Given a listing type, return the appropriate entry from the
	     * LISTING_TEMPLATES array. This method returns the entry for the default
	     * listing template type if not enty exists for the specified type.
	     */
	    var getListingInfo = requireGetListingInfo();

	    var isCustomListingType = requireIsCustomListingType();

	    var validateForm = requireValidateForm();

	    /**
	     * Convert the listing editor form entry fields into wiki text. This
	     * method converts the form entry fields into a listing template string,
	     * replaces the original template string in the section text with the
	     * updated entry, and then submits the section text to be saved on the
	     * server.
	     */
	    var formToText = function(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber) {
	        var listing = listingTemplateAsMap;
	        var defaultListingParameters = getListingInfo(DEFAULT_LISTING_TEMPLATE);
	        var listingTypeInput = defaultListingParameters[LISTING_TYPE_PARAMETER].id;
	        var listingType = $(`#${listingTypeInput}`).val();
	        var listingParameters = getListingInfo(listingType);
	        for (var parameter in listingParameters) {
	            listing[parameter] = $(`#${listingParameters[parameter].id}`).val();
	        }
	        for (var i=0; i < Callbacks.SUBMIT_FORM_CALLBACKS.length; i++) {
	            Callbacks.SUBMIT_FORM_CALLBACKS[i](listing, mode);
	        }
	        var text = listingToStr(listing);
	        var summary = editSummarySection();
	        if (mode == MODE_ADD) {
	            summary = updateSectionTextWithAddedListing(summary, text, listing);
	        } else {
	            summary = updateSectionTextWithEditedListing(summary, text, listingTemplateWikiSyntax);
	        }
	        summary += $("#input-name").val();
	        if ($(EDITOR_SUMMARY_SELECTOR).val() !== '') {
	            summary += ` - ${$(EDITOR_SUMMARY_SELECTOR).val()}`;
	        }
	        var minor = $(EDITOR_MINOR_EDIT_SELECTOR).is(':checked') ? true : false;
	        saveForm(summary, minor, sectionNumber, '', '');
	        return;
	    };

	    var showPreview = function(listingTemplateAsMap) {
	        var listing = listingTemplateAsMap;
	        var defaultListingParameters = getListingInfo(DEFAULT_LISTING_TEMPLATE);
	        var listingTypeInput = defaultListingParameters[LISTING_TYPE_PARAMETER].id;
	        var listingType = $(`#${listingTypeInput}`).val();
	        var listingParameters = getListingInfo(listingType);
	        for (var parameter in listingParameters) {
	            listing[parameter] = $(`#${listingParameters[parameter].id}`).val();
	        }
	        var text = listingToStr(listing);
	        $.ajax ({
	            url: `${mw.config.get('wgScriptPath')}/api.php?${$.param({
	                action: 'parse',
	                prop: 'text',
	                contentmodel: 'wikitext',
	                format: 'json',
	                text,
	            })}`
	        } ).then( ( data ) => {
	            $('#listing-preview-text').html(data.parse.text['*']);
	        } );
	    };

	    /**
	     * Begin building the edit summary by trying to find the section name.
	     */
	    var editSummarySection = requireEditSummarySection();
	    var getSectionName = requireGetSectionName();
	    var updateSectionTextWithAddedListing = requireUpdateSectionTextWithAddedListing();
	    var updateSectionTextWithEditedListing = requireUpdateSectionTextWithEditedListing();

	    /**
	     * Render a dialog that notifies the user that the listing editor changes
	     * are being saved.
	     */
	    var savingForm = function() {
	        // if a progress dialog is already open, get rid of it
	        if ($(SAVE_FORM_SELECTOR).length > 0) {
	            dialog.destroy(SAVE_FORM_SELECTOR);
	        }
	        var progress = $(`<div id="progress-dialog">${translate( 'saving' )}</div>`);
	        dialog.open(progress, {
	            modal: true,
	            height: 100,
	            width: 300,
	            title: ''
	        });
	        $(".ui-dialog-titlebar").hide();
	    };

	    const savePayload = requireSavePayload();

	    /**
	     * Execute the logic to post listing editor changes to the server so that
	     * they are saved. After saving the page is refreshed to show the updated
	     * article.
	     */
	    var saveForm = function(summary, minor, sectionNumber, cid, answer) {
	        var editPayload = {
	            action: "edit",
	            title: mw.config.get( "wgPageName" ),
	            section: sectionNumber,
	            text: getSectionText(),
	            summary,
	            captchaid: cid,
	            captchaword: answer
	        };
	        if (minor) {
	            $.extend( editPayload, { minor: 'true' } );
	        }
	        savePayload( editPayload).then(function(data) {
	            if (data && data.edit && data.edit.result == 'Success') {
	                if ( data.edit.nochange !== undefined ) {
	                    alert( 'Save skipped as there was no change to the content!' );
	                    dialog.destroy(SAVE_FORM_SELECTOR);
	                    return;
	                }
	                // since the listing editor can be used on diff pages, redirect
	                // to the canonical URL if it is different from the current URL
	                var canonicalUrl = $("link[rel='canonical']").attr("href");
	                var currentUrlWithoutHash = window.location.href.replace(window.location.hash, "");
	                if (canonicalUrl && currentUrlWithoutHash != canonicalUrl) {
	                    var sectionName = mw.util.escapeIdForLink(getSectionName());
	                    if (sectionName.length) {
	                        canonicalUrl += `#${sectionName}`;
	                    }
	                    window.location.href = canonicalUrl;
	                } else {
	                    window.location.reload();
	                }
	            } else if (data && data.error) {
	                saveFailed(`${translate( 'submitApiError' )} "${data.error.code}": ${data.error.info}` );
	            } else if (data && data.edit.spamblacklist) {
	                saveFailed(`${translate( 'submitBlacklistError' )}: ${data.edit.spamblacklist}` );
	            } else if (data && data.edit.captcha) {
	                dialog.destroy(SAVE_FORM_SELECTOR);
	                captchaDialog(summary, minor, sectionNumber, data.edit.captcha.url, data.edit.captcha.id);
	            } else {
	                saveFailed(translate( 'submitUnknownError' ));
	            }
	        }, function(code, result) {
	            if (code === "http") {
	                saveFailed(`${translate( 'submitHttpError' )}: ${result.textStatus}` );
	            } else if (code === "ok-but-empty") {
	                saveFailed(translate( 'submitEmptyError' ));
	            } else {
	                saveFailed(`${translate( 'submitUnknownError' )}: ${code}` );
	            }
	        });
	        savingForm();
	    };

	    /**
	     * If an error occurs while saving the form, remove the "saving" dialog,
	     * restore the original listing editor form (with all user content), and
	     * display an alert with a failure message.
	     */
	    var saveFailed = function(msg) {
	        dialog.destroy(SAVE_FORM_SELECTOR);
	        dialog.open($(EDITOR_FORM_SELECTOR));
	        alert(msg);
	    };

	    /**
	     * If the result of an attempt to save the listing editor content is a
	     * Captcha challenge then display a form to allow the user to respond to
	     * the challenge and resubmit.
	     */
	    var captchaDialog = function(summary, minor, sectionNumber, captchaImgSrc, captchaId) {
	        // if a captcha dialog is already open, get rid of it
	        if ($(CAPTCHA_FORM_SELECTOR).length > 0) {
	            dialog.destroy(CAPTCHA_FORM_SELECTOR);
	        }
	        var captcha = $('<div id="captcha-dialog">').text(translate( 'externalLinks' ));
	        $('<img class="fancycaptcha-image">')
	                .attr('src', captchaImgSrc)
	                .appendTo(captcha);
	        $('<label for="input-captcha">').text(translate( 'enterCaptcha' )).appendTo(captcha);
	        $('<input id="input-captcha" type="text">').appendTo(captcha);
	        dialog.open(captcha, {
	            modal: true,
	            title: translate( 'enterCaptcha' ),
	            buttons: [
	                {
	                    text: translate( 'submit' ),
	                    // eslint-disable-next-line object-shorthand
	                    click: function() {
	                        saveForm(summary, minor, sectionNumber, captchaId, $('#input-captcha').val());
	                        dialog.destroy(this);
	                    }
	                },
	                {
	                    text: translate( 'cancel' ),
	                    // eslint-disable-next-line object-shorthand
	                    click: function() {
	                        dialog.destroy(this);
	                    }
	                }
	            ]
	        });
	    };

	    // expose public members
	    return {
	        initListingEditorDialog,
	        MODE_ADD,
	        MODE_EDIT
	    };
	};

	Core_1 = Core;
	return Core_1;
}

const TRANSLATIONS_ALL = translations;
const makeTranslateFunction = makeTranslateFunction$2;
const parseDMS = parseDMS_1;
const { LANG } = globalConfig;
const translateModule = translate_1;
const { loadCallbacks } = Callbacks_1;
const { loadConfig } = Config;

var src = ( function ( ALLOWED_NAMESPACE, SECTION_TO_TEMPLATE_TYPE, PROJECT_CONFIG ) {

	var PROJECT_CONFIG_KEYS = [
		'SHOW_LAST_EDITED_FIELD', 'SUPPORTED_SECTIONS',
		'listingTypeRegExp', 'REPLACE_NEW_LINE_CHARS', 'LISTING_TEMPLATES_OMIT',
		'VALIDATE_CALLBACKS_EMAIL', 'SUBMIT_FORM_CALLBACKS_UPDATE_LAST_EDIT',
		'ALLOW_UNRECOGNIZED_PARAMETERS_LOOKUP',
		'LISTING_TYPE_PARAMETER', 'LISTING_CONTENT_PARAMETER',
		'DEFAULT_LISTING_TEMPLATE', 'SLEEP_TEMPLATE_PARAMETERS',
		'LISTING_TEMPLATE_PARAMETERS', 'WIKIDATAID', 'SPECIAL_CHARS'
	];

	// check project has been setup correctly with no missing keys.
	PROJECT_CONFIG_KEYS.forEach( function ( key ) {
		if ( PROJECT_CONFIG[ key ] === undefined ) {
			throw new Error( `Project must define project setting ${key}` );
		}
	} );

	const userLanguage = mw.config.get( 'wgUserLanguage' );
	var TRANSLATIONS = Object.assign(
		{},
		TRANSLATIONS_ALL.en,
		TRANSLATIONS_ALL[ userLanguage ]
	);

	Object.keys( TRANSLATIONS_ALL.en ).forEach( function ( key ) {
		// check the key is present in all the other configurations
		Object.keys( TRANSLATIONS_ALL ).forEach( function ( lang ) {
			if ( lang === 'en' ) {
				return; // no need to check against itself
			} else {
				if ( TRANSLATIONS_ALL[ lang ][ key ] === undefined && userLanguage === lang) {
					mw.log.warn( `Language missing translation ${key} will fall back to English.` );
				}
			}
		} );
	} );

	const translate = makeTranslateFunction( TRANSLATIONS );
	translateModule.init( TRANSLATIONS );

	const Config = function() {
		var WIKIDATAID = PROJECT_CONFIG.WIKIDATAID;

		var lookupField = function ( property ) {
			return TRANSLATIONS[`property${property}`] || [];
		};


		//	- doNotUpload: hide upload option
		//	- remotely_sync: for fields which can auto-acquire values, leave the local value blank when syncing
		var WIKIDATA_CLAIMS = {
			'coords':		{ 'p': 'P625', 'label': 'coordinates', 'fields': lookupField( 'P625'), 'remotely_sync': false, },
			'url':			{ 'p': 'P856', 'label': 'website', 'fields': lookupField( 'P856') }, // link
			'email':		{ 'p': 'P968', 'label': 'e-mail', 'fields': lookupField( 'P968') },
			'iata':			{ 'p': 'P238', 'label': 'IATA code (if Alt is empty)', 'fields': lookupField( 'P238'), 'doNotUpload': true, },
			'image':		{ 'p': 'P18', 'label': 'image', 'fields': lookupField( 'P18'), 'remotely_sync': true, }
		};

		// set this flag to false if the listing editor should strip away any
		// listing template parameters that are not explicitly configured in the
		// LISTING_TEMPLATES parameter arrays (such as wikipedia, phoneextra, etc).
		// if the flag is set to true then unrecognized parameters will be allowed
		// as long as they have a non-empty value.
		var ALLOW_UNRECOGNIZED_PARAMETERS = PROJECT_CONFIG.ALLOW_UNRECOGNIZED_PARAMETERS_LOOKUP;

		// name of the generic listing template to use when a more specific
		// template ("see", "do", etc) is not appropriate
		var DEFAULT_LISTING_TEMPLATE = PROJECT_CONFIG.DEFAULT_LISTING_TEMPLATE;
		var LISTING_TYPE_PARAMETER = PROJECT_CONFIG.LISTING_TYPE_PARAMETER;
		var LISTING_CONTENT_PARAMETER = PROJECT_CONFIG.LISTING_CONTENT_PARAMETER;
		// The arrays below must include entries for each listing template
		// parameter in use for each Wikivoyage language version - for example
		// "name", "address", "phone", etc. If all listing template types use
		// the same parameters then a single configuration array is sufficient,
		// but if listing templates use different parameters or have different
		// rules about which parameters are required then the differences must
		// be configured - for example, English Wikivoyage uses "checkin" and
		// "checkout" in the "sleep" template, so a separate
		// SLEEP_TEMPLATE_PARAMETERS array has been created below to define the
		// different requirements for that listing template type.
		//
		// Once arrays of parameters are defined, the LISTING_TEMPLATES
		// mapping is used to link the configuration to the listing template
		// type, so in the English Wikivoyage example all listing template
		// types use the LISTING_TEMPLATE_PARAMETERS configuration EXCEPT for
		// "sleep" listings, which use the SLEEP_TEMPLATE_PARAMETERS
		// configuration.
		//
		// Fields that can used in the configuration array(s):
		//	- id: HTML input ID in the EDITOR_FORM_HTML for this element.
		//	- hideDivIfEmpty: id of a <div> in the EDITOR_FORM_HTML for this
		//	  element that should be hidden if the corresponding template
		//	  parameter has no value. For example, the "fax" field is
		//	  little-used and is not shown by default in the editor form if it
		//	  does not already have a value.
		//	- skipIfEmpty: Do not include the parameter in the wiki template
		//	  syntax that is saved to the article if the parameter has no
		//	  value. For example, the "image" tag is not included by default
		//	  in the listing template syntax unless it has a value.
		//	- newline: Append a newline after the parameter in the listing
		//	  template syntax when the article is saved.
		var LISTING_TEMPLATE_PARAMETERS = PROJECT_CONFIG.LISTING_TEMPLATE_PARAMETERS;
		// map the template name to configuration information needed by the listing
		// editor
		var LISTING_TEMPLATES = {};

		PROJECT_CONFIG.SUPPORTED_SECTIONS.forEach( function ( key ) {
			if ( key === 'sleep' ) {
				// override the default settings for "sleep" listings since that
				// listing type uses "checkin"/"checkout" instead of "hours"
				LISTING_TEMPLATES[ key ] = $.extend(
					true, {},
					LISTING_TEMPLATE_PARAMETERS,
					PROJECT_CONFIG.SLEEP_TEMPLATE_PARAMETERS
				);
			} else {
				LISTING_TEMPLATES[ key ] = LISTING_TEMPLATE_PARAMETERS;
			}
		} );

		( PROJECT_CONFIG.LISTING_TEMPLATES_OMIT || [] ).forEach( function ( key ) {
			delete LISTING_TEMPLATES[ key ];
		} );

		const {
			EDITOR_FORM_SELECTOR,
			EDITOR_CLOSED_SELECTOR,
			EDITOR_SUMMARY_SELECTOR,
			EDITOR_MINOR_EDIT_SELECTOR
		} = requireSelectors();

		// the below HTML is the UI that will be loaded into the listing editor
		// dialog box when a listing is added or edited. EACH WIKIVOYAGE
		// LANGUAGE SITE CAN CUSTOMIZE THIS HTML - fields can be removed,
		// added, displayed differently, etc. Note that it is important that
		// any changes to the HTML structure are also made to the
		// LISTING_TEMPLATES parameter arrays since that array provides the
		// mapping between the editor HTML and the listing template fields.
		const EDITOR_FORM_HTML = requireHtml$1()(
			translate,
			PROJECT_CONFIG.SPECIAL_CHARS,
			PROJECT_CONFIG.SHOW_LAST_EDITED_FIELD
		);
		// expose public members
		return {
			LANG,
			WIKIDATAID,
			WIKIDATA_CLAIMS,
			TRANSLATIONS,
			ALLOWED_NAMESPACE,
			DEFAULT_LISTING_TEMPLATE,
			LISTING_TYPE_PARAMETER,
			LISTING_CONTENT_PARAMETER,
			ALLOW_UNRECOGNIZED_PARAMETERS,
			SECTION_TO_TEMPLATE_TYPE,
			LISTING_TEMPLATES,
			EDITOR_FORM_SELECTOR,
			EDITOR_CLOSED_SELECTOR,
			EDITOR_SUMMARY_SELECTOR,
			EDITOR_MINOR_EDIT_SELECTOR,
			EDITOR_FORM_HTML
		};
	}();

	/* ***********************************************************************
	 * Callbacks implements custom functionality that may be
	 * specific to how a Wikivoyage language version has implemented the
	 * listing template. For example, English Wikivoyage uses a "last edit"
	 * date that needs to be populated when the listing editor form is
	 * submitted, and that is done via custom functionality implemented as a
	 * SUBMIT_FORM_CALLBACK function in this module.
	 * ***********************************************************************/
	var Callbacks = function() {
		// array of functions to invoke when creating the listing editor form.
		// these functions will be invoked with the form DOM object as the
		// first element and the mode as the second element.
		var CREATE_FORM_CALLBACKS = [];
		// array of functions to invoke when submitting the listing editor
		// form but prior to validating the form. these functions will be
		// invoked with the mapping of listing attribute to value as the first
		// element and the mode as the second element.
		var SUBMIT_FORM_CALLBACKS = [];
		// array of validation functions to invoke when the listing editor is
		// submitted. these functions will be invoked with an array of
		// validation messages as an argument; a failed validation should add a
		// message to this array, and the user will be shown the messages and
		// the form will not be submitted if the array is not empty.
		var VALIDATE_FORM_CALLBACKS = [];

		// --------------------------------------------------------------------
		// LISTING EDITOR UI INITIALIZATION CALLBACKS
		// --------------------------------------------------------------------

		/**
		 * Add listeners to specific strings so that clicking on a string
		 * will insert it into the associated input.
		 */
		var initStringFormFields = function(form) {
			var STRING_SELECTOR = '.listing-charinsert';
			$(STRING_SELECTOR, form).on( 'click', function() {
				var target = $(this).attr('data-for');
				var fieldInput = $(`#${target}`);
				var caretPos = fieldInput[0].selectionStart;
				var oldField = fieldInput.val();
				var string = $(this).find('a').text();
				var newField = oldField.substring(0, caretPos) + string + oldField.substring(caretPos);
				fieldInput.val(newField);
				fieldInput.select();
				// now setting the cursor behind the string inserted
				fieldInput[0].setSelectionRange(caretPos + string.length, caretPos + string.length);
			});
		};
		CREATE_FORM_CALLBACKS.push(initStringFormFields);

		/**
		 * Add listeners on various fields to update the "find on map" link.
		 */
		var initFindOnMapLink = function(form) {
			var latlngStr = `?lang=${LANG}`;
			//*****
			// page & location cause the geomap-link crash
			// to investigate if it's a geomap-link bug/limitation or if those parameters shall not be used
			//*****
			// try to find and collect the best available coords
			if ( $('#input-lat', form).val() && $('#input-long', form).val() ) {
				// listing specific coords
				latlngStr += `&lat=${parseDMS($('#input-lat', form).val())}&lon=${parseDMS($('#input-long', form).val())}&zoom=15`;
			} else if ( $('.mw-indicators .geo').lenght ) {
				// coords added by Template:Geo
				latlngStr += `&lat=${parseDMS($('.mw-indicators .geo .latitude').text())}&lon=${parseDMS($('.mw-indicators .geo .longitude').text())}&zoom=15`;
			}
			// #geomap-link is a link in the EDITOR_FORM_HTML
			$('#geomap-link', form).attr('href', $('#geomap-link', form).attr('href') + latlngStr);
			$('#input-lat', form).change( function () {updateHrefCoord(form);} );
			$('#input-long', form).change( function () {updateHrefCoord(form);} );
		};
		CREATE_FORM_CALLBACKS.push(initFindOnMapLink);

		/**
		 * Update coords on href "find on map" link.
		 */
		var updateHrefCoord = function(form) {
			var link = $('#geomap-link').attr('href');
			if (!link) link = $('#geomap-link', form).attr('href');
			link = generateCoordUrl4Href(link, form);
			if ($('#geomap-link').attr('href'))
				$('#geomap-link').attr('href', link);
			else
				$('#geomap-link', form).attr('href', link);
		};

		/**
		 * Generate coords URL in get format to be attached on href attribute in "find on map" link.
		 */
		var generateCoordUrl4Href = function(link, form) {
			var coord = {lat: NaN, lon: NaN};
			var newLink = link;
			coord = getBestCoord(form); //coord has been already parsedDMS
			if ( link ) {
				var indexLat = link.indexOf('&lat');
				var indexZoom = link.indexOf('&zoom');
				if (indexLat >= 0)
					newLink = link.substr(0,indexLat); //remove coord inside the link
				if ( !isNaN(coord.lat) && !isNaN(coord.lon) ) { //add new coord if available
					newLink = `${newLink}&lat=${coord.lat}&lon=${coord.lon}`;
					if (indexZoom < 0)
						newLink = `${newLink}&zoom=15`;
					else
						newLink = newLink + link.substr(indexZoom);
				}
			}
			return newLink;
		};

		/**
		 * Get best available coords between the listing one and the article one.
		 */
		var getBestCoord = function(form) {
			var coord = {lat: NaN, lon: NaN};
			if ( $('#input-lat', form).val() && $('#input-long', form).val() ) {
				coord.lat = $('#input-lat', form).val();
				coord.lon = $('#input-long', form).val();
			} else if ( $('.mw-indicators .geo').lenght ) {
				coord.lat = $('.mw-indicators .geo .latitude').text();
				coord.lon = $('.mw-indicators .geo .longitude').text();
			}
			coord.lat = parseDMS(coord.lat);
			coord.lon = parseDMS(coord.lon);
			return coord;
		};

		var hideEditOnlyFields = function(form, mode) {
			if (mode !== Core.MODE_EDIT) {
				$('#div_status', form).hide();
			}
		};
		CREATE_FORM_CALLBACKS.push(hideEditOnlyFields);

		var typeToColor = function(listingType, form) {
			$('#input-type', form).css( 'box-shadow', 'unset' );
			$.ajax ({
				listingType,
				form,
				url: `${mw.config.get('wgScriptPath')}/api.php?${$.param({
					action: 'parse',
					prop: 'text',
					contentmodel: 'wikitext',
					format: 'json',
					disablelimitreport: true,
					'text': `{{#invoke:TypeToColor|convert|${listingType}}}`,
				})}`,
				// eslint-disable-next-line object-shorthand
				beforeSend: function() {
					if (localStorage.getItem(`listing-${listingType}`)) {
						changeColor(localStorage.getItem(`listing-${listingType}`), form);
						return false;
					}
					else { return true; }
				},
				// eslint-disable-next-line object-shorthand
				success: function (data) {
					var color = $(data.parse.text['*']).text().trim();
					localStorage.setItem(`listing-${listingType}`, color);
					changeColor(color, form);
				},
			});
		};
		var changeColor = function(color, form) {
			$('#input-type', form).css( 'box-shadow', `-20px 0 0 0 #${color} inset` );
		};
		var initColor = function(form) {
			typeToColor( $('#input-type', form).val(), form );
			$('#input-type', form).on('change', function () {
				typeToColor(this.value, form);
			});
		};
		CREATE_FORM_CALLBACKS.push(initColor);

		var isRTL = function (s){ // based on https://stackoverflow.com/questions/12006095/javascript-how-to-check-if-character-is-rtl
			var ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
			rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
			// eslint-disable-next-line no-misleading-character-class
			rtlDirCheck = new RegExp(`^[^${ltrChars}]*[${rtlChars}]`);
			return rtlDirCheck.test(s);
		};
		var autoDir = function(selector) {
			if (selector.val() && !isRTL(selector.val())) {
				selector.prop('dir', 'ltr');
			}
			selector.keyup(function() {
				if ( isRTL(selector.val()) ) {
					selector.prop('dir', 'rtl');
				}
				else {
					selector.prop('dir', 'ltr');
				}
			});
		};
		var autoDirParameters = function(form) {
			autoDir($('#input-alt', form));
		};
		CREATE_FORM_CALLBACKS.push(autoDirParameters);

		var setDefaultPlaceholders = function(form) {
			[
				'name',
				'alt',
				'url',
				'address',
				'directions',
				'phone',
				'tollfree',
				'fax',
				'email',
				'lastedit',
				'lat',
				'long',
				'hours',
				'checkin',
				'checkout',
				'price',
				'wikidata-label',
				'wikipedia',
				'image',
				'content',
				'summary'
			].forEach( function ( key ) {
				$(`#input-${key}`, form).attr( 'placeholder', translate(`placeholder-${key}` ) );
			} );
		};
		CREATE_FORM_CALLBACKS.push(setDefaultPlaceholders);

		// --------------------------------------------------------------------
		// LISTING EDITOR FORM SUBMISSION CALLBACKS
		// --------------------------------------------------------------------

		/**
		 * Return the current date in the format "2015-01-15".
		 */
		var currentLastEditDate = function() {
			var d = new Date();
			var year = d.getFullYear();
			// Date.getMonth() returns 0-11
			var month = d.getMonth() + 1;
			if (month < 10) month = `0${month}`;
			var day = d.getDate();
			if (day < 10) day = `0${day}`;
			return `${year}-${month}-${day}`;
		};

		/**
		 * Only update last edit date if this is a new listing or if the
		 * "information up-to-date" box checked.
		 */
		var updateLastEditDate = function(listing, mode) {
			var LISTING_LAST_EDIT_PARAMETER = 'lastedit';
			var EDITOR_LAST_EDIT_SELECTOR = '#input-last-edit';
			if (mode == Core.MODE_ADD || $(EDITOR_LAST_EDIT_SELECTOR).is(':checked')) {
				listing[LISTING_LAST_EDIT_PARAMETER] = currentLastEditDate();
			}
		};
		if ( PROJECT_CONFIG.SUBMIT_FORM_CALLBACKS_UPDATE_LAST_EDIT ) {
			SUBMIT_FORM_CALLBACKS.push(updateLastEditDate);
		}

		// --------------------------------------------------------------------
		// LISTING EDITOR FORM VALIDATION CALLBACKS
		// --------------------------------------------------------------------

		/**
		 * Verify all listings have at least a name, address or alt value.
		 */
		var validateListingHasData = function(validationFailureMessages) {
			if ($('#input-name').val() === '' && $('#input-address').val() === '' && $('#input-alt').val() === '') {
				validationFailureMessages.push( translate( 'validationEmptyListing' ) );
			}
		};
		VALIDATE_FORM_CALLBACKS.push(validateListingHasData);

		/**
		 * Implement SIMPLE validation on email addresses. Invalid emails can
		 * still get through, but this method implements a minimal amount of
		 * validation in order to catch the worst offenders.
		 * Disabled for now, TODO: multiple email support.
		 */
		var validateEmail = function(validationFailureMessages) {
			var VALID_EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
			_validateFieldAgainstRegex(
				validationFailureMessages,
				VALID_EMAIL_REGEX, '#input-email',
				translate( 'validationEmail' )
			);
		};
		if ( PROJECT_CONFIG.VALIDATE_CALLBACKS_EMAIL ) {
			VALIDATE_FORM_CALLBACKS.push(validateEmail);
		}

		/**
		 * Implement SIMPLE validation on Wikipedia field to verify that the
		 * user is entering the article title and not a URL.
		 */
		var validateWikipedia = function(validationFailureMessages) {
			var VALID_WIKIPEDIA_REGEX = new RegExp('^(?!https?://)', 'i');
			_validateFieldAgainstRegex(validationFailureMessages, VALID_WIKIPEDIA_REGEX, '#input-wikipedia', translate( 'validationWikipedia' ) );
		};
		VALIDATE_FORM_CALLBACKS.push(validateWikipedia);

		/**
		 * Implement SIMPLE validation on the Commons field to verify that the
		 * user has not included a "File" or "Image" namespace.
		 */
		var validateImage = function(validationFailureMessages) {
			var VALID_IMAGE_REGEX = new RegExp(`^(?!(file|image|${translate( 'image' )}):)`, 'i');
			_validateFieldAgainstRegex(validationFailureMessages, VALID_IMAGE_REGEX, '#input-image', translate( 'validationImage' ) );
		};
		VALIDATE_FORM_CALLBACKS.push(validateImage);

		var _validateFieldAgainstRegex = function(validationFailureMessages, validationRegex, fieldPattern, failureMsg) {
			var fieldValue = $(fieldPattern).val().trim();
			if (fieldValue !== '' && !validationRegex.test(fieldValue)) {
				validationFailureMessages.push(failureMsg);
			}
		};

		// expose public members
		return {
			CREATE_FORM_CALLBACKS,
			SUBMIT_FORM_CALLBACKS,
			VALIDATE_FORM_CALLBACKS
		};
	}();
	loadCallbacks( Callbacks );
	loadConfig( Config, PROJECT_CONFIG );

	/* ***********************************************************************
	 * Core contains code that should be shared across different
	 * Wikivoyage languages. This code uses the custom configurations in the
	 * Config and Callback modules to initialize
	 * the listing editor and process add and update requests for listings.
	 * ***********************************************************************/
	var Core = requireCore()( Callbacks, Config, PROJECT_CONFIG, translate );

	return Core;
} );

//</nowiki>

var index = /*@__PURE__*/getDefaultExportFromCjs(src);

module.exports = index;
