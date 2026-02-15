/**
 * Listing Editor v4.5.0
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
window.__WIKIVOYAGE_LISTING_EDITOR_VERSION__ = '4.5.0'

'use strict';

var require$$2$1 = require('vue');
var require$$0$1 = require('@wikimedia/codex');

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var propertyP625$2 = [
	"lat",
	"long"
];
var propertyP856$3 = [
	"url"
];
var propertyP968$2 = [
	"email"
];
var propertyP238$2 = [
	"alt"
];
var propertyP18$3 = [
	"image"
];
var addTitle$4 = "Add New Listing";
var editTitle$4 = "Edit Existing Listing";
var addTitleBeta$3 = "Add New Listing (Beta)";
var editTitleBeta$3 = "Edit Existing Listing (Beta)";
var syncTitle$4 = "Wikidata Sync";
var saving$4 = "Saving...";
var submit$4 = "Submit";
var budget$3 = "Budget";
var midrange$3 = "Mid-range";
var splurge$3 = "Splurge";
var cancel$4 = "Cancel";
var cancelAll$4 = "Clear all";
var preview$4 = "Preview";
var previewOff$4 = "Preview off";
var refresh$4 = "↺";
var refreshTitle$4 = "Refresh preview";
var selectAll$4 = "Select all";
var selectAlternatives$4 = "Select all values where the alternative is empty.";
var validationEmptyListing$4 = "Please enter either a name or an address";
var validationEmail$4 = "Please ensure the email address is valid";
var validationWikipedia$4 = "Please insert the Wikipedia page title only; not the full URL address";
var validationImage$4 = "Please insert the Commons image title only without any prefix";
var validationCoords$1 = "Please enter latitude and longitude coordinates both in the decimal form e.g. 29.9773, 31.1325";
var added$4 = "Added listing for ";
var updated$4 = "Updated listing for ";
var removed$4 = "Deleted listing for ";
var helpPage$4 = "//en.wikivoyage.org/wiki/Wikivoyage:Listing_editor";
var enterCaptcha$4 = "Enter CAPTCHA";
var externalLinks$4 = "Your edit includes new external links.";
var licenseText$4 = "By clicking \"Submit\", you agree to the <a class=\"external\" target=\"_blank\" href=\"//wikimediafoundation.org/wiki/Terms_of_use\">Terms of use</a>, and you irrevocably agree to release your contribution under the <a class=\"external\" target=\"_blank\" href=\"//en.wikivoyage.org/wiki/Wikivoyage:Full_text_of_the_Attribution-ShareAlike_3.0_license\">CC-BY-SA 3.0 License</a>. You agree that a hyperlink or URL is sufficient attribution under the Creative Commons license.";
var ajaxInitFailure$4 = "Error: Unable to initialize the listing editor";
var sharedWikipedia$3 = "wikipedia";
var synchronized$4 = "synchronized.";
var submitApiError$4 = "Error: The server returned an error while attempting to save the listing, please try again";
var submitBlacklistError$4 = "Error: A value in the data submitted has been blacklisted, please remove the blacklisted pattern and try again";
var submitUnknownError$4 = "Error: An unknown error has been encountered while attempting to save the listing, please try again";
var submitHttpError$4 = "The server responded with an HTTP error while attempting to save the listing, please try again";
var submitEmptyError$4 = "Error: The server returned an empty response while attempting to save the listing, please try again";
var viewCommonsPage$4 = "view Commons page";
var viewWikidataPage$4 = "view Wikidata record";
var viewWikipediaPage$4 = "view Wikipedia page";
var wikidataSharedMatch$4 = "No differences found between local and Wikidata values";
var wikidataShared$4 = "The following data was found in the shared Wikidata record. Update shared fields using these values?";
var wikidataSharedNotFound$4 = "No shared data found in the Wikidata repository";
var wikidataSyncBlurb$4 = "Selecting a value will change both websites to match (selecting an empty value will delete from both). Selecting neither will change nothing. Please err toward selecting one of the values rather than skipping - there are few cases when we should prefer to have a different value intentionally. You are encouraged to go to the Wikidata item and add references for any data you change.";
var editSummary$4 = "Edit Summary";
var name$4 = "Name";
var alt$3 = "Alt";
var website$4 = "Website";
var address$4 = "Address";
var directions$4 = "Directions";
var phone$4 = "Phone";
var tollfree$4 = "Tollfree";
var fax$4 = "Fax";
var lastUpdated$3 = "Last Updated";
var syncWikidata$4 = "Sync shared fields to/from Wikidata";
var syncWikidataTitle$4 = "This simply gets the values from Wikidata and replaces the local values. Useful for new listings.";
var syncWikidataLabel$4 = "(quick fetch)";
var content$4 = "Content";
var minorTitle$4 = "Check the box if the change to the listing is minor, such as a typo correction";
var minorLabel$4 = "minor change?";
var email$5 = "Email";
var type$4 = "Type";
var latitude$4 = "Latitude";
var longitude$4 = "Longitude";
var findOnMap$4 = "find on map";
var hours$4 = "Hours";
var checkin$3 = "Check-in";
var checkout$3 = "Check-out";
var price$4 = "Price";
var wpWd$4 = "Get ID from Wikipedia article";
var wikidataRemoveTitle$4 = "Delete the Wikidata entry from this listing";
var wikidataRemoveLabel$4 = "remove";
var image$5 = "Image";
var listingTooltip$4 = "Check the box if the business is no longer in operation or if the listing should be deleted for some other reason, and it will be removed from this article";
var listingLabel$4 = "delete this listing?";
var listingUpdatedTooltip$3 = "Check the box if the information in this listing has been verified to be current and accurate, and the last updated date will be changed to the current date";
var listingUpdatedLabel$3 = "mark the listing as up-to-date?";
var natlCurrencyTitle$4 = "";
var intlCurrenciesTitle$4 = "";
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
	propertyP625: propertyP625$2,
	propertyP856: propertyP856$3,
	propertyP968: propertyP968$2,
	propertyP238: propertyP238$2,
	propertyP18: propertyP18$3,
	addTitle: addTitle$4,
	editTitle: editTitle$4,
	addTitleBeta: addTitleBeta$3,
	editTitleBeta: editTitleBeta$3,
	syncTitle: syncTitle$4,
	saving: saving$4,
	submit: submit$4,
	budget: budget$3,
	midrange: midrange$3,
	splurge: splurge$3,
	cancel: cancel$4,
	cancelAll: cancelAll$4,
	preview: preview$4,
	previewOff: previewOff$4,
	refresh: refresh$4,
	refreshTitle: refreshTitle$4,
	selectAll: selectAll$4,
	selectAlternatives: selectAlternatives$4,
	validationEmptyListing: validationEmptyListing$4,
	validationEmail: validationEmail$4,
	validationWikipedia: validationWikipedia$4,
	validationImage: validationImage$4,
	validationCoords: validationCoords$1,
	added: added$4,
	updated: updated$4,
	removed: removed$4,
	helpPage: helpPage$4,
	enterCaptcha: enterCaptcha$4,
	externalLinks: externalLinks$4,
	licenseText: licenseText$4,
	ajaxInitFailure: ajaxInitFailure$4,
	sharedWikipedia: sharedWikipedia$3,
	synchronized: synchronized$4,
	submitApiError: submitApiError$4,
	submitBlacklistError: submitBlacklistError$4,
	submitUnknownError: submitUnknownError$4,
	submitHttpError: submitHttpError$4,
	submitEmptyError: submitEmptyError$4,
	viewCommonsPage: viewCommonsPage$4,
	viewWikidataPage: viewWikidataPage$4,
	viewWikipediaPage: viewWikipediaPage$4,
	wikidataSharedMatch: wikidataSharedMatch$4,
	wikidataShared: wikidataShared$4,
	wikidataSharedNotFound: wikidataSharedNotFound$4,
	wikidataSyncBlurb: wikidataSyncBlurb$4,
	editSummary: editSummary$4,
	name: name$4,
	alt: alt$3,
	website: website$4,
	address: address$4,
	directions: directions$4,
	phone: phone$4,
	tollfree: tollfree$4,
	fax: fax$4,
	lastUpdated: lastUpdated$3,
	syncWikidata: syncWikidata$4,
	syncWikidataTitle: syncWikidataTitle$4,
	syncWikidataLabel: syncWikidataLabel$4,
	content: content$4,
	minorTitle: minorTitle$4,
	minorLabel: minorLabel$4,
	email: email$5,
	type: type$4,
	latitude: latitude$4,
	longitude: longitude$4,
	findOnMap: findOnMap$4,
	hours: hours$4,
	checkin: checkin$3,
	checkout: checkout$3,
	price: price$4,
	wpWd: wpWd$4,
	wikidataRemoveTitle: wikidataRemoveTitle$4,
	wikidataRemoveLabel: wikidataRemoveLabel$4,
	image: image$5,
	listingTooltip: listingTooltip$4,
	listingLabel: listingLabel$4,
	listingUpdatedTooltip: listingUpdatedTooltip$3,
	listingUpdatedLabel: listingUpdatedLabel$3,
	natlCurrencyTitle: natlCurrencyTitle$4,
	intlCurrenciesTitle: intlCurrenciesTitle$4
};

var propertyP625$1 = [
	"vĩ độ",
	"kinh độ"
];
var propertyP856$2 = [
	"url"
];
var propertyP968$1 = [
	"email"
];
var propertyP238$1 = [
	"tên khác"
];
var propertyP18$2 = [
	"hình ảnh"
];
var addTitle$3 = "Thêm địa điểm mới";
var editTitle$3 = "Sửa địa điểm hiện tại";
var addTitleBeta$2 = "Thêm địa điểm mới (beta)";
var editTitleBeta$2 = "Sửa địa điểm hiện tại (beta)";
var syncTitle$3 = "Đồng bộ Wikidata";
var saving$3 = "Đang lưu...";
var submit$3 = "Lưu";
var budget$2 = "Phổ thông";
var midrange$2 = "Tầm trung";
var splurge$2 = "Hạng sang";
var cancel$3 = "Hủy";
var cancelAll$3 = "Xóa tất cả";
var preview$3 = "Xem trước";
var previewOff$3 = "Tắt xem trước";
var refresh$3 = "↺";
var refreshTitle$3 = "Làm mới xem trước";
var selectAll$3 = "Chọn tất cả";
var selectAlternatives$3 = "Chọn tất cả các giá trị mà không có tên thay thế.";
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
var licenseText$3 = "Khi lưu thay đổi, bạn chấp nhận <a class=\"external\" target=\"_blank\" href=\"//foundation.wikimedia.org/wiki/Special:MyLanguage/Terms_of_use/vi\">Điều khoản sử dụng</a>, và bạn đồng ý phát hành, một cách không thể hủy bỏ, các đóng góp của bạn theo <a class=\"external\" target=\"_blank\" href=\"//vi.wikipedia.org/wiki/Wikipedia:Nguyên_văn_Giấy_phép_Creative_Commons_Ghi_công–Chia_sẻ_tương_tự_phiên_bản_4.0_Quốc_tế\">Giấy phép CC-BY-SA 4.0</a>. Bạn đồng ý rằng một siêu liên kết hoặc URL là đủ điều kiện ghi công theo giấy phép Creative Commons.";
var ajaxInitFailure$3 = "Lỗi: Không thể khởi tạo trình soạn thảo địa điểm";
var sharedWikipedia$2 = "wikipedia";
var synchronized$3 = "đã đồng bộ.";
var submitApiError$3 = "Lỗi: Máy chủ trả về lỗi khi cố gắng lưu địa điểm, vui lòng thử lại";
var submitBlacklistError$3 = "Lỗi: Một giá trị trong dữ liệu đã gửi nằm trong danh sách đen, vui lòng xóa dữ liệu bị cấm và thử lại";
var submitUnknownError$3 = "Lỗi: Đã xảy ra lỗi không xác định khi cố gắng lưu địa điểm, vui lòng thử lại";
var submitHttpError$3 = "Lỗi: Máy chủ phản hồi với lỗi HTTP khi cố gắng lưu địa điểm, vui lòng thử lại";
var submitEmptyError$3 = "Lỗi: Máy chủ trả về phản hồi trống khi cố gắng lưu địa điểm, vui lòng thử lại";
var viewCommonsPage$3 = "xem trang Commons";
var viewWikidataPage$3 = "xem khoản mục Wikidata";
var viewWikipediaPage$3 = "xem trang Wikipedia";
var wikidataSharedMatch$3 = "Không tìm thấy sự khác biệt giữa giá trị cục bộ và Wikidata";
var wikidataShared$3 = "Dữ liệu sau đã được tìm thấy trong khoản mục Wikidata chung. Cập nhật các trường chung bằng các giá trị này?";
var wikidataSharedNotFound$3 = "Không tìm thấy dữ liệu chung trong khoản mục Wikidata";
var wikidataSyncBlurb$3 = "Chọn một giá trị sẽ thay đổi cả hai trang web để khớp nhau (chọn một giá trị trống sẽ xóa khỏi cả hai). Không chọn gì sẽ không thay đổi. Vui lòng nghiêng về việc chọn một trong các giá trị thay vì bỏ qua - có rất ít trường hợp chúng ta nên cố ý có giá trị khác.<p>Bạn được khuyến khích truy cập khoản mục Wikidata và thêm nguồn tham khảo cho bất kỳ dữ liệu nào bạn thay đổi.";
var editSummary$3 = "Tóm lược sửa đổi";
var name$3 = "Tên";
var alt$2 = "Tên khác";
var website$3 = "Trang web";
var address$3 = "Địa chỉ";
var directions$3 = "Chỉ đường";
var phone$3 = "Điện thoại";
var tollfree$3 = "Điện thoại miễn cước";
var fax$3 = "Fax";
var lastUpdated$2 = "Cập nhật lần cuối";
var syncWikidata$3 = "Đồng bộ các trường chung với/từ Wikidata";
var syncWikidataTitle$3 = "Điều này chỉ đơn giản lấy các giá trị từ Wikidata và thay thế các giá trị cục bộ. Hữu ích cho địa điểm mới.";
var syncWikidataLabel$3 = "(truy xuất nhanh)";
var content$3 = "Nội dung";
var minorTitle$3 = "Tích vào ô nếu thay đổi đối với địa điểm là nhỏ, chẳng hạn như sửa lỗi chính tả";
var minorLabel$3 = "thay đổi nhỏ?";
var email$4 = "Email";
var type$3 = "Loại";
var latitude$3 = "Vĩ độ";
var longitude$3 = "Kinh độ";
var findOnMap$3 = "tìm trên bản đồ";
var hours$3 = "Giờ mở cửa";
var checkin$2 = "Nhận phòng";
var checkout$2 = "Trả phòng";
var price$3 = "Giá";
var wpWd$3 = "Lấy ID từ bài viết Wikipedia";
var wikidataRemoveTitle$3 = "Xóa khoản mục Wikidata khỏi địa điểm này";
var wikidataRemoveLabel$3 = "xóa";
var image$4 = "Hình ảnh";
var listingTooltip$3 = "Tích vào ô nếu doanh nghiệp không còn hoạt động hoặc nếu địa điểm nên bị xóa vì lý do khác, để xóa địa điểm khỏi bài viết này";
var listingLabel$3 = "xóa địa điểm này?";
var listingUpdatedTooltip$2 = "Tích vào ô nếu thông tin trong địa điểm này là có thật và chính xác, và ngày cập nhật lần cuối sẽ được thay đổi thành ngày hiện tại";
var listingUpdatedLabel$2 = "đánh dấu địa điểm là đã cập nhật?";
var natlCurrencyTitle$3 = "";
var intlCurrenciesTitle$3 = "";
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
	"placeholder-wikidata-label": "khoản mục Wikidata",
	"placeholder-wikipedia": "bài viết Wikipedia",
	"placeholder-image": "hình ảnh địa điểm",
	"placeholder-content": "mô tả địa điểm",
	"placeholder-summary": "lý do thay đổi địa điểm",
	propertyP625: propertyP625$1,
	propertyP856: propertyP856$2,
	propertyP968: propertyP968$1,
	propertyP238: propertyP238$1,
	propertyP18: propertyP18$2,
	addTitle: addTitle$3,
	editTitle: editTitle$3,
	addTitleBeta: addTitleBeta$2,
	editTitleBeta: editTitleBeta$2,
	syncTitle: syncTitle$3,
	saving: saving$3,
	submit: submit$3,
	budget: budget$2,
	midrange: midrange$2,
	splurge: splurge$2,
	cancel: cancel$3,
	cancelAll: cancelAll$3,
	preview: preview$3,
	previewOff: previewOff$3,
	refresh: refresh$3,
	refreshTitle: refreshTitle$3,
	selectAll: selectAll$3,
	selectAlternatives: selectAlternatives$3,
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
	email: email$4,
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

var added$2 = "Élément ajouté : ";
var address$2 = "Adresse";
var addTitle$2 = "Ajouter un nouvel élément";
var addTitleBeta$1 = "Ajouter un nouvel élément (Bêta)";
var ajaxInitFailure$2 = "Erreur : impossible d’initialiser l’éditeur de fiches";
var alt$1 = "Autre nom";
var budget$1 = "Bon marché";
var cancel$2 = "Annuler";
var cancelAll$2 = "Tout annuler";
var checkin$1 = "Arrivée";
var checkout$1 = "Départ";
var content$2 = "Description";
var directions$2 = "Indications";
var editSummary$2 = "Résumé de la modification";
var editTitle$2 = "Modifier l’élément existant";
var editTitleBeta$1 = "Modifier l’élément existant (Bêta)";
var email$3 = "Email";
var enterCaptcha$2 = "Entrez le CAPTCHA";
var externalLinks$2 = "Votre modification inclut de nouveaux liens externes.";
var fax$2 = "Fax";
var findOnMap$2 = "localiser sur geomap";
var helpPage$2 = "//fr.wikivoyage.org/wiki/Aide:Éditeur_de_Listing";
var hours$2 = "Horaires";
var image$3 = "Image";
var intlCurrenciesTitle$2 = "Symboles des monnaies internationales";
var lastUpdated$1 = "Dernière mise à jour";
var latitude$2 = "Latitude";
var licenseText$2 = "En cliquant sur « Enregistrer », vous acceptez expressément les <a class=\"external\" target=\"_blank\" href=\"http://wikimediafoundation.org/wiki/Terms_of_Use/fr\">Conditions d’utilisation</a>, et acceptez irrévocablement de publier votre contribution sous la <a class=\"external\" target=\"_blank\" href=\"https://fr.wikivoyage.org/wiki/Wikivoyage:Texte_de_la_licence_Creative_Commons_Attribution-Partage_dans_les_Mêmes_Conditions_3.0_Unported\">licence CC‑BY‑SA 3.0</a>.";
var listingLabel$2 = "Supprimer ?";
var listingTooltip$2 = "Cochez la case si l’établissement n’est plus en activité afin de le retirer de cet article";
var listingUpdatedLabel$1 = "marquer l’élément comme mis à jour ?";
var listingUpdatedTooltip$1 = "Cochez la case si les informations de cette fiche ont été vérifiées comme à jour et exactes ; la date de dernière mise à jour sera remplacée par la date du jour.";
var longitude$2 = "Longitude";
var midrange$1 = "Prix moyens";
var minorLabel$2 = "modification mineure ?";
var minorTitle$2 = "Cochez la case si la modification est mineure, comme la correction d’une faute";
var name$2 = "Nom";
var natlCurrencyTitle$2 = "Symboles de la monnaie nationale";
var phone$2 = "Téléphone";
var preview$2 = "Aperçu";
var previewOff$2 = "Pas d’aperçu";
var price$2 = "Prix";
var propertyP18$1 = "image";
var propertyP238 = "alt";
var propertyP625 = [
	"lat",
	"long"
];
var propertyP856$1 = "site";
var propertyP968 = "email";
var refresh$2 = "↺";
var refreshTitle$2 = "Actualiser l’aperçu";
var removed$2 = "Élément effacé : ";
var saving$2 = "Enregistrement...";
var selectAll$2 = "Tout sélectionner";
var selectAlternatives$2 = "Sélectionner toutes les valeurs dont l’alternative est vide.";
var sharedWikipedia$1 = "wikipédia";
var splurge$1 = "Luxe";
var submit$2 = "Enregistrer";
var submitApiError$2 = "Erreur : le serveur a renvoyé une erreur lors de l’enregistrement de l’élément, veuillez réessayer";
var submitBlacklistError$2 = "Erreur : une valeur envoyée figure dans la « blacklist », veuillez la retirer et réessayer";
var submitEmptyError$2 = "Erreur : le serveur a renvoyé une réponse vide lors de l’enregistrement de l’élément, veuillez réessayer";
var submitHttpError$2 = "Erreur : le serveur a renvoyé une erreur HTTP lors de l’enregistrement de l’élément, veuillez réessayer";
var submitUnknownError$2 = "Erreur : une erreur inconnue s’est produite lors de l’enregistrement de l’élément, veuillez réessayer";
var synchronized$2 = "- champ synchronisé.";
var syncTitle$2 = "Synchronisation Wikidata";
var syncWikidata$2 = "Synchroniser avec Wikidata";
var syncWikidataLabel$2 = "(insertion rapide)";
var syncWikidataTitle$2 = "Cela remplace simplement les valeurs locales par celles de Wikidata. Utile pour les nouvelles fiches.";
var tollfree$2 = "Numéro gratuit";
var type$2 = "Type";
var updated$2 = "Élément mis à jour : ";
var validationCoords = "Entrez les coordonnées de latitude et longitude au format décimal, par exemple 29.9773, 31.1325";
var validationEmail$2 = "Controler que l'adresse électronique soit correcte";
var validationEmptyListing$2 = "Entrez au moins un nom ou une adresse";
var validationImage$2 = "Veuillez insérer le titre de l'image de Commons sans préfixe";
var validationWikipedia$2 = "Veuillez insérer le titre de la page Wikipédia seulement; Pas l'adresse URL complète";
var viewCommonsPage$2 = "Voir l’image sur Commons";
var viewWikidataPage$2 = "Voir l’élément sur Wikidata";
var viewWikipediaPage$2 = "Voir l’article sur Wikipédia";
var website$2 = "Site web";
var wikidataRemoveLabel$2 = "supprimer";
var wikidataRemoveTitle$2 = "Supprimer l’élément Wikidata de cette fiche";
var wikidataShared$2 = "Les données suivantes ont été trouvées sur Wikidata. Mettre à jour les champs correspondants avec ces valeurs ?";
var wikidataSharedMatch$2 = "Aucune différence trouvée entre les valeurs locales et celles de Wikidata";
var wikidataSharedNotFound$2 = "Aucune donnée n’a été récupérée depuis Wikidata";
var wikidataSyncBlurb$2 = "La valeur sélectionnée sera modifiée sur les deux sites afin de correspondre (sélectionner une valeur vide la supprimera des deux). Ne rien sélectionner n’entraînera aucun changement. Il vaut mieux risquer de se tromper en choisissant une valeur que de ne rien faire — certains cas nécessitent volontairement des valeurs différentes entre les deux sites. Vous êtes encouragé à ajouter des références aux données modifiées directement sur Wikidata.";
var wpWd$2 = "Obtenir l’ID depuis l’article Wikipédia";
var require$$2 = {
	added: added$2,
	address: address$2,
	addTitle: addTitle$2,
	addTitleBeta: addTitleBeta$1,
	ajaxInitFailure: ajaxInitFailure$2,
	alt: alt$1,
	budget: budget$1,
	cancel: cancel$2,
	cancelAll: cancelAll$2,
	checkin: checkin$1,
	checkout: checkout$1,
	content: content$2,
	"coordinates-error": "Les coordonnées ont un format non valide. Utilisez les degrés décimaux.",
	directions: directions$2,
	editSummary: editSummary$2,
	editTitle: editTitle$2,
	editTitleBeta: editTitleBeta$1,
	email: email$3,
	enterCaptcha: enterCaptcha$2,
	externalLinks: externalLinks$2,
	fax: fax$2,
	findOnMap: findOnMap$2,
	helpPage: helpPage$2,
	hours: hours$2,
	image: image$3,
	intlCurrenciesTitle: intlCurrenciesTitle$2,
	lastUpdated: lastUpdated$1,
	latitude: latitude$2,
	licenseText: licenseText$2,
	"listing-editor-version": "Version $1",
	listingLabel: listingLabel$2,
	listingTooltip: listingTooltip$2,
	listingUpdatedLabel: listingUpdatedLabel$1,
	listingUpdatedTooltip: listingUpdatedTooltip$1,
	longitude: longitude$2,
	midrange: midrange$1,
	minorLabel: minorLabel$2,
	minorTitle: minorTitle$2,
	name: name$2,
	natlCurrencyTitle: natlCurrencyTitle$2,
	phone: phone$2,
	"placeholder-address": "adresse du lieu",
	"placeholder-alt": "également connu sous le nom de",
	"placeholder-checkin": "heure d’arrivée",
	"placeholder-checkout": "heure de départ",
	"placeholder-content": "description du lieu",
	"placeholder-directions": "comment arriver ici",
	"placeholder-email": "info@exemple.com",
	"placeholder-fax": "+55 555 555 555",
	"placeholder-hours": "Lun-Ven 9:00-17:00",
	"placeholder-image": "image du lieu",
	"placeholder-lastedit": "2020-01-15",
	"placeholder-lat": "11.11111",
	"placeholder-long": "111.11111",
	"placeholder-name": "nom du lieu",
	"placeholder-phone": "+55 555 555 5555",
	"placeholder-price": "prix",
	"placeholder-summary": "Motif de modification de l’élément",
	"placeholder-tollfree": "+1 800 100 1000",
	"placeholder-url": "https://www.exemple.com",
	"placeholder-wikidata-label": "élément Wikidata",
	"placeholder-wikipedia": "article Wikipédia",
	preview: preview$2,
	previewOff: previewOff$2,
	price: price$2,
	propertyP18: propertyP18$1,
	propertyP238: propertyP238,
	propertyP625: propertyP625,
	propertyP856: propertyP856$1,
	propertyP968: propertyP968,
	refresh: refresh$2,
	refreshTitle: refreshTitle$2,
	removed: removed$2,
	"report-bug": "Signaler un problème",
	saving: saving$2,
	selectAll: selectAll$2,
	selectAlternatives: selectAlternatives$2,
	sharedWikipedia: sharedWikipedia$1,
	splurge: splurge$1,
	submit: submit$2,
	submitApiError: submitApiError$2,
	submitBlacklistError: submitBlacklistError$2,
	submitEmptyError: submitEmptyError$2,
	submitHttpError: submitHttpError$2,
	submitUnknownError: submitUnknownError$2,
	synchronized: synchronized$2,
	syncTitle: syncTitle$2,
	syncWikidata: syncWikidata$2,
	syncWikidataLabel: syncWikidataLabel$2,
	syncWikidataTitle: syncWikidataTitle$2,
	tollfree: tollfree$2,
	type: type$2,
	updated: updated$2,
	validationCoords: validationCoords,
	validationEmail: validationEmail$2,
	validationEmptyListing: validationEmptyListing$2,
	validationImage: validationImage$2,
	validationWikipedia: validationWikipedia$2,
	viewCommonsPage: viewCommonsPage$2,
	viewWikidataPage: viewWikidataPage$2,
	viewWikipediaPage: viewWikipediaPage$2,
	website: website$2,
	wikidataRemoveLabel: wikidataRemoveLabel$2,
	wikidataRemoveTitle: wikidataRemoveTitle$2,
	wikidataShared: wikidataShared$2,
	wikidataSharedMatch: wikidataSharedMatch$2,
	wikidataSharedNotFound: wikidataSharedNotFound$2,
	wikidataSyncBlurb: wikidataSyncBlurb$2,
	wpWd: wpWd$2
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
var wikidataSyncBlurb$1 = "Memilih salah satu nilai data akan mengubah kedua situs web agar sesuai (memilih nilai kosong akan menghapus data dari keduanya). Tidak memilih salah satu pun juga takkan mengubah apa pun. Mohon pilih salah satu nilai alih-alih melewatkannya - ada beberapa kasus di mana kita sebaiknya sengaja memilih nilai yang berbeda. Anda disarankan untuk membuka butir Wikidata dan menambahkan referensi untuk setiap data yang Anda ubah.";
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
var email$2 = "Surel";
var type$1 = "Jenis";
var latitude$1 = "Lintang";
var longitude$1 = "Bujur";
var findOnMap$1 = "cari di peta";
var hours$1 = "Jam buka";
var price$1 = "Harga";
var wpWd$1 = "Dapatkan ID dari artikel Wikipedia";
var wikidataRemoveTitle$1 = "Hapus entri Wikidata dari butir senarai ini";
var wikidataRemoveLabel$1 = "hapus";
var image$2 = "Gambar";
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
	email: email$2,
	type: type$1,
	latitude: latitude$1,
	longitude: longitude$1,
	findOnMap: findOnMap$1,
	hours: hours$1,
	price: price$1,
	wpWd: wpWd$1,
	wikidataRemoveTitle: wikidataRemoveTitle$1,
	wikidataRemoveLabel: wikidataRemoveLabel$1,
	image: image$2,
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
var email$1 = "Email";
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
var image$1 = "Immagine";
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
var wikidataSyncBlurb = "Il valore selezionato cambierà in entrambi i siti Web in modo che corrispondano (selezionando un valore vuoto verrà eliminato da entrambi). Non selezionare nessuno dei due, non comporterà alcuna modifica. Si prega rischiare di sbagliare scegliendo uno dei valori piuttosto che non fare niente - ci sono alcuni casi in cui è preferibile avere intenzionalmente un valore diverso tra i due siti. Sei incoraggiato ad andare nell'elemento Wikidata per aggiungere i riferimenti di un qualsiasi dato che cambi.";
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
	email: email$1,
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
	image: image$1,
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

/**
 * @param {Object<string,string>} translations
 * @return {string}
 */

var makeTranslateFunction$1 = ( translations ) => {
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

const makeTranslateFunction = makeTranslateFunction$1;
let internalTranslateFn;

const translate = ( key, ...parameters ) => {
    if ( !internalTranslateFn ) {
        throw 'Translations not setup';
    } else {
        return internalTranslateFn( key, ...parameters );
    }
};

const init = ( TRANSLATIONS ) => {
    internalTranslateFn = makeTranslateFunction( TRANSLATIONS );
};

var translate_1 = {
    translate,
    init
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
	    EDITOR_MINOR_EDIT_SELECTOR: '#input-minor',
	    EDITOR_CLOSED_SELECTOR: '#input-closed',
	    EDITOR_SUMMARY_SELECTOR: '#input-summary'
	};
	return selectors;
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

var translatePlugin_1;
var hasRequiredTranslatePlugin;

function requireTranslatePlugin () {
	if (hasRequiredTranslatePlugin) return translatePlugin_1;
	hasRequiredTranslatePlugin = 1;
	const { translate } = translate_1;
	const translatePlugin = {
	    install: ( app ) => {
	        const $translate = ( key, ...parameters ) => {
	            return translate( key, ...parameters );
	        };
	        app.config.globalProperties.$translate = $translate;
	        app.provide( 'translate', $translate );
	    }
	};
	translatePlugin_1 = translatePlugin;
	return translatePlugin_1;
}

var translateDirective;
var hasRequiredTranslateDirective;

function requireTranslateDirective () {
	if (hasRequiredTranslateDirective) return translateDirective;
	hasRequiredTranslateDirective = 1;
	const { translate } = translate_1;
	const renderI18nHtml = ( el, binding ) => {
	    el.innerHTML = translate( binding.arg || binding.value );
	};

	translateDirective = {
	    mounted: renderI18nHtml
	};
	return translateDirective;
}

var createApp_1;
var hasRequiredCreateApp;

function requireCreateApp () {
	if (hasRequiredCreateApp) return createApp_1;
	hasRequiredCreateApp = 1;
	const { createApp } = require$$2$1;
	const translatePlugin = requireTranslatePlugin();
	const translateDirective = requireTranslateDirective();

	const createListingEditorApp = ( component, props ) => {

	    const app = createApp( component, props );
	    app.use( translatePlugin );

	    app.directive( 'translate-html', translateDirective );

	    return app;
	};

	createApp_1 = createListingEditorApp;
	return createApp_1;
}

var dialogs;
var hasRequiredDialogs;

function requireDialogs () {
	if (hasRequiredDialogs) return dialogs;
	hasRequiredDialogs = 1;
	const createApp = requireCreateApp();

	function close() {
	    document.documentElement.classList.remove( 'listing-editor-dialog-open' );
	}

	function render( Dialog, options ) {
	    const vueAppContainer = document.createElement( 'div' );
	    document.body.appendChild(vueAppContainer);
	    const app = createApp(
	        Dialog,
	        Object.assign( {}, options || {}, {
	            onClose: () => {
	                close();
	            }
	        } )
	    );
	    app.mount( vueAppContainer );
	    document.documentElement.classList.add( 'listing-editor-dialog-open' );
	    vueAppContainer.focus();
	    return {
	        unmount: () => {
	            app.unmount();
	            close();
	        }
	    }
	}

	dialogs = {
	    render
	};
	return dialogs;
}

var ListingEditorDialog;
var hasRequiredListingEditorDialog;

function requireListingEditorDialog () {
	if (hasRequiredListingEditorDialog) return ListingEditorDialog;
	hasRequiredListingEditorDialog = 1;
	const { CdxDialog, CdxTextInput, CdxMessage, CdxButton, CdxProgressBar } = require$$0$1;
	const { defineComponent, ref, onMounted } = require$$2$1;

	ListingEditorDialog = defineComponent( {
	    name: 'ListingEditorDialog',
	    components: {
	        CdxProgressBar,
	        CdxDialog,
	        CdxMessage,
	        CdxTextInput,
	        CdxButton
	    },
	    template: `<cdx-dialog
v-model:open="isOpen"
:title="title"
:default-action="defaultAction"
:class="dialogClass"
:useCloseButton="!modal"
@update:open="closeAction"
>
<div v-if="saveInProgress" id="progress-dialog">
    <div v-if="captchaRequested">
        <div id="captcha-dialog">
            <strong>{{ $translate( 'enterCaptcha' ) }}</strong>
            <p>{{ $translate( 'externalLinks' ) }}</p>
            <img class="fancycaptcha-image" :src="captchaRequested">
            <cdx-text-input id="input-captcha"></cdx-text-input>
            <cdx-button @click="onCaptchaSubmit">{{ $translate( 'submit' ) }}</cdx-button>
        </div>
    </div>
    <div v-else>
        <cdx-progress-bar
            :aria-label="$translate( 'saving' )"></cdx-progress-bar>
        {{ $translate( 'saving' ) }}
    </div>
</div>
<div v-else class="ui-dialog-content" ref="targetElement">
    <slot />
</div>
<template #footer>
    <div class="ui-dialog-buttonpane" v-if="submitAction">
        <div v-if="!saveInProgress" class="ui-dialog-buttonset">
            <cdx-button v-if="helpClickAction" id="listing-help" @click="helpClickAction">?</cdx-button>
            <cdx-button class="submitButton"
                @click="submitAction" :disabled="disabledMessage"> {{ $translate( 'submit' ) }}</cdx-button>
            <cdx-button @click="closeAction">{{ $translate( 'cancel' ) }}</cdx-button>
        </div>
        <div if="!saveInProgress">
            <div v-if="disabledMessage">
                <cdx-message>{{ disabledMessage }}</cdx-message>
            </div>
            <div v-else-if="!modal" class="listing-license"
                v-translate-html:licenseText></div>
            <span class="listing-license">{{ $translate('listing-editor-version', [ version ]) }}</span>
            <span class="listing-license">&nbsp;<a href="https://github.com/jdlrobson/Gadget-Workshop/issues">
                {{ $translate( 'report-bug' ) }}</a></span>
        </div>
    </div>
</template>
</cdx-dialog>`,
	    props: {
	        disabledMessage: {
	            type: String
	        },
	        version: {
	            type: String,
	            default: window.__WIKIVOYAGE_LISTING_EDITOR_VERSION__
	        },
	        modal: {
	            type: Boolean
	        },
	        title: {
	            type: String
	        },
	        dialogClass: {
	            type: String
	        },
	        dialogElement: {
	            type: HTMLElement,
	            required: false
	        },
	        onCaptchaSubmit: {
	            type: Function
	        },
	        onSubmit: {
	            type: Function
	        },
	        onMount: {
	            type: Function,
	            default: () => {}
	        },
	        onClose: {
	            type: Function
	        },
	        onHelp: {
	            type: Function,
	            required: false
	        }
	    },
	    setup( {
	        title,
	        disabledSubmitButton,
	        onCaptchaSubmit,
	        onSubmit, onClose, dialogElement, dialogClass, onHelp, onMount
	    } ) {
	        const activeXhr = ref( null );
	        const captchaRequested = ref( '' );
	        const saveInProgress = ref( false );
	        const defaultAction = {
	            label: 'Cancel'
	        };
	        const isOpen = ref( true );
	        const closeDialog = () => {
	            isOpen.value = false;
	            saveInProgress.value = false;
	        };
	        const setCaptcha = ( url ) => {
	            captchaRequested.value = url;
	        };
	        const submitAction = () => {
	            saveInProgress.value = true;
	            const xhr = onSubmit( closeDialog, () => {
	                saveInProgress.value = false;
	            }, setCaptcha );
	            activeXhr.value = xhr;
	        };
	        const closeAction = () => {
	            if ( saveInProgress.value && activeXhr.value ) {
	                if ( activeXhr.value.abort ) {
	                    activeXhr.value.abort();
	                }
	                saveInProgress.value = false;
	                return;
	            }
	            onClose();
	            closeDialog();
	        };
	        const targetElement = ref(null);
	        onMounted(() => {
	            if (targetElement.value && dialogElement ) {
	                targetElement.value.appendChild( dialogElement );
	            }
	            onMount( targetElement.value );
	        });
	        return {
	            onCaptchaSubmit: () => {
	                onCaptchaSubmit( setCaptcha, closeAction );
	            },
	            disabledSubmitButton,
	            captchaRequested,
	            saveInProgress,
	            title,
	            dialogClass,
	            targetElement,
	            closeAction,
	            defaultAction,
	            isOpen,
	            helpClickAction: onHelp,
	            submitAction
	        }
	    }
	} );
	return ListingEditorDialog;
}

var mapSearchResult_1;
var hasRequiredMapSearchResult;

function requireMapSearchResult () {
	if (hasRequiredMapSearchResult) return mapSearchResult_1;
	hasRequiredMapSearchResult = 1;
	const mapSearchResult = ( results ) => {
	    return ( results[1] || [] ).map( ( result ) => {
	        const value = result.indexOf( ':' ) === -1 ? result : result.split( ':' )[ 1 ];
	        return {
	            value,
	            label: value
	        };
	    } );
	};

	mapSearchResult_1 = mapSearchResult;
	return mapSearchResult_1;
}

var getWikidataFromWikipedia;
var hasRequiredGetWikidataFromWikipedia;

function requireGetWikidataFromWikipedia () {
	if (hasRequiredGetWikidataFromWikipedia) return getWikidataFromWikipedia;
	hasRequiredGetWikidataFromWikipedia = 1;
	getWikidataFromWikipedia = function( titles, SisterSite ) {
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
	return getWikidataFromWikipedia;
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
	        return value.toFixed(precision);
	    }
	};

	trimDecimal_1 = trimDecimal;
	return trimDecimal_1;
}

/**
 * Convert splitted elements of coordinates in DMS notation into DD notation.
 * If the input is already in DD notation (i.e. only degrees is a number), input value is returned unchanged.
 * Notes:
 * 1) Each D, M & S is checked to be a valid number plus M & S are checked to be in a valid range. If one parameter is not valid, NaN (Not a Number) is returned
 * 2) Empty string (provided from initial parsing section in parseDMS) are considered valid by isNaN function (i.e. isNaN('') is false)
 */

var parseDMS_1;
var hasRequiredParseDMS;

function requireParseDMS () {
	if (hasRequiredParseDMS) return parseDMS_1;
	hasRequiredParseDMS = 1;
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
	var parseDMS = function(input) {
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

	parseDMS_1 = parseDMS;
	return parseDMS_1;
}

var updateFieldIfNotNull_1;
var hasRequiredUpdateFieldIfNotNull;

function requireUpdateFieldIfNotNull () {
	if (hasRequiredUpdateFieldIfNotNull) return updateFieldIfNotNull_1;
	hasRequiredUpdateFieldIfNotNull = 1;
	const updateFieldIfNotNull = function(selector, value, placeholderBool) {
	    if ( value !== null ) {
	        if ( placeholderBool !== true ) {
	            $(selector).val(value);
	        }
	    }
	};

	updateFieldIfNotNull_1 = updateFieldIfNotNull;
	return updateFieldIfNotNull_1;
}

var ListingSyncRowLink;
var hasRequiredListingSyncRowLink;

function requireListingSyncRowLink () {
	if (hasRequiredListingSyncRowLink) return ListingSyncRowLink;
	hasRequiredListingSyncRowLink = 1;
	ListingSyncRowLink = {
	    name: 'ListingSyncRowLink',
	    props: {
	        href: {
	            type: String
	        }
	    },
	    template: `<a v-if="href"
    target="_blank" rel="noopener noreferrer" :href="href"><slot /></a><slot v-else />`
	};
	return ListingSyncRowLink;
}

var ListingSyncRow;
var hasRequiredListingSyncRow;

function requireListingSyncRow () {
	if (hasRequiredListingSyncRow) return ListingSyncRow;
	hasRequiredListingSyncRow = 1;
	const ListingSyncRowLink = requireListingSyncRowLink();

	ListingSyncRow = {
	    name: 'ListingSyncRow',
	    components: {
	        ListingSyncRowLink
	    },
	    props: {
	        selected: {
	            type: String,
	            default: ''
	        },
	        field: {
	            type: Object,
	            required: true
	        },
	        guid: {
	            type: String
	        },
	        wikidataUrl: {
	            type: String
	        },
	        localUrl: {
	            type: String
	        },
	        localText: {
	            type: String
	        },
	        wikidataText: {
	            type: String
	        },
	        skip: {
	            type: Boolean
	        },
	        remoteFlag: {
	            type: Boolean
	        }
	    },
	    computed: {
	        divStyle() {
	            return this.remoteFlag ? 'display: none' : undefined;
	        }
	    },
	    template: `<div>
<div v-if="!remoteFlag" class="sync_label">{{ field.label }}</div>
<div class="choose-row" :style="divStyle">
    <div>&nbsp;<label :for="field.label + '-wd'"><listing-sync-row-link
        :href="wikidataUrl">{{ wikidataText }}</listing-sync-row-link></label>
    </div>
    <div class="has-guid">
        <input type="radio" :id="field.label+'-wd'" :name="field.label"
            :checked="remoteFlag || selected === 'wd'">
        <input type="hidden" :value="guid">
    </div>
    <div v-if="!remoteFlag">
        <input type="radio" :name="field.label" :checked="selected === ''">
    </div>
    <div class="has-json">
        <input v-if="remoteFlag !== true && field.doNotUpload !== true"
            :checked="selected === 'wv'"
            type="radio" :id="field.label+'-wv'" :name="field.label">
        <input v-else type="radio" disabled>
        <input type="hidden" :value='JSON.stringify(field)'>
    </div>
    <div>&nbsp;<label :for="field.label+'-wv'"><listing-sync-row-link
:href="localUrl">{{ localText }}</listing-sync-row-link></label></div>
</div>
</div>`
	};
	return ListingSyncRow;
}

var ListingEditorSync;
var hasRequiredListingEditorSync;

function requireListingEditorSync () {
	if (hasRequiredListingEditorSync) return ListingEditorSync;
	hasRequiredListingEditorSync = 1;
	const ListingSyncRow = requireListingSyncRow();

	ListingEditorSync = {
	    name: 'ListingEditorSync',
	    components: {
	        ListingSyncRow
	    },
	    props: {
	        syncValues: {
	            type: Array
	        }
	    },
	    data() {
	        return {
	            selected: ''
	        };
	    },
	    methods: {
	        clearAll() {
	            this.selected = '';
	        },
	        syncSelect( selected ) {
	            this.selected = selected;
	        }
	    },
	    template: `<form id="listing-editor-sync">
<p>{{
    $translate( 'wikidataSyncBlurb' )
}}</p>
<fieldset>
    <span>
        <span class="wikidata-update"></span>
        <a href="javascript:" class="syncSelect" name="wd"
            @click="syncSelect( 'wd' )"
            :title="$translate( 'selectAll' )">Wikidata</a>
    </span>
    <a href="javascript:" id="autoSelect" class="listing-tooltip"
        :title="$translate( 'selectAlternatives' )">Auto</a>
    <span>
        <a href="javascript:" class="syncSelect"
            name="wv"
            @click="syncSelect( 'wv' )"
            :title="$translate( 'selectAll' )">Wikivoyage</a>
        <span class="wikivoyage-update"></span>
    </span>
</fieldset>
<div class="editor-fullwidth">
    <listing-sync-row v-for="row in syncValues"
        :field="row.field"
        :guid="row.guid || 'null'"
        :wikidataUrl="row.wikidataUrl"
        :localUrl="row.localUrl"
        :localText="row.localText"
        :wikidataText="row.wikidataText"
        :skip="row.skip"
        :selected="selected"
        :remoteFlag="row.remoteFlag"
    ></listing-sync-row>
</div>
<small>
    <a href="javascript:" class="clear"
        @click="clearAll">{{ $translate( 'cancelAll' ) }}</a>
</small>
</form>
`
	};
	return ListingEditorSync;
}

var ListingEditorSyncDialog;
var hasRequiredListingEditorSyncDialog;

function requireListingEditorSyncDialog () {
	if (hasRequiredListingEditorSyncDialog) return ListingEditorSyncDialog;
	hasRequiredListingEditorSyncDialog = 1;
	const ListingEditorDialog = requireListingEditorDialog();
	const ListingEditorSync = requireListingEditorSync();

	ListingEditorSyncDialog = {
	    name: 'ListingEditorSyncDialog',
	    template: `<ListingEditorDialog>
    <ListingEditorSync :sync-values="syncValues"></ListingEditorSync>
</ListingEditorDialog>`,
	    props: {
	        syncValues: {
	            type: Object
	        }
	    },
	    components: {
	        ListingEditorDialog,
	        ListingEditorSync
	    }
	};
	return ListingEditorSyncDialog;
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
	const parseDMS = requireParseDMS();
	const { LANG } = globalConfig;
	const { getConfig } = Config;

	const prepareSyncValues = ( value, valBool ) => {
	    return value.map( ( selectorOrValue ) => valBool ?
	        $(selectorOrValue).val() : selectorOrValue );
	};

	const prepareSyncUrl = function(unprocessedValue, mode, valBool) {
	    const value = prepareSyncValues( unprocessedValue, valBool );
	    const { WIKIDATA_CLAIMS } = getConfig();
	    let prefix = '';
	    let suffix = '';
	    switch(mode) {
	        case WIKIDATA_CLAIMS.coords.p:
	            prefix += 'https://geohack.toolforge.org/geohack.php?params=';
	            prefix += value.map(v=>parseDMS(v)).join(';');
	            suffix = '_type:landmark'; // sets the default zoom
	            break;
	        case WIKIDATA_CLAIMS.image.p:
	            prefix += `https://${LANG}.wikivoyage.org/wiki/File:`;
	            prefix += value.map(v=>v).join('');
	            break;
	        default:
	            prefix += value.map(v=>v).join('');
	            break;
	    }
	    return `${prefix}${suffix}`;
	};

	const makeSyncLinks = function(unprocessedValue, mode, valBool) {
	    const href = prepareSyncUrl( unprocessedValue, mode, valBool );
	    return `<a target="_blank" rel="noopener noreferrer"href="${href}">`
	};

	makeSyncLinks_1 = {
	    prepareSyncUrl,
	    makeSyncLinks
	};
	return makeSyncLinks_1;
}

var prepareRadio_1;
var hasRequiredPrepareRadio;

function requirePrepareRadio () {
	if (hasRequiredPrepareRadio) return prepareRadio_1;
	hasRequiredPrepareRadio = 1;
	const { prepareSyncUrl } = requireMakeSyncLinks();
	const parseDMS = requireParseDMS();
	const trimDecimal = requireTrimDecimal();
	const { getConfig } = Config;

	const prepareRadio = function(field, claimValue, guid) {
	    const { LISTING_TEMPLATES, WIKIDATA_CLAIMS } = getConfig();

	    var j = 0;
	    for (j = 0; j < claimValue.length; j++) {
	        if( claimValue[j] === null ) {
	            claimValue[j] = '';
	        }
	    }
	    field.label = field.label.split(/(\s+)/)[0]; // take first word
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

	    // if remotely synced, and there aren't any value(s) here or they are identical, skip with a message
	    // also create an invisible radio button so that updateFieldIfNotNull is called
	    if ( (field.remotely_sync === true) && ( j === claimValue.length || ( ( $(editorField[0]).val() === '' ) && ( ($(editorField[1]).val() === '' ) || ($(editorField[1]).val() === undefined) ) ) ) ) {
	        remoteFlag = true;
	    }

	    const hasSyncLink = [
	        WIKIDATA_CLAIMS.coords.p,
	        WIKIDATA_CLAIMS.url.p,
	        WIKIDATA_CLAIMS.image.p
	    ].indexOf(field.p) >= 0;
	    return {
	        field,
	        wikidataUrl: hasSyncLink ? prepareSyncUrl(claimValue, field.p, false) : undefined,
	        localUrl: hasSyncLink ? prepareSyncUrl(editorField, field.p, true): undefined,
	        editorField,
	        skip: ( j === claimValue.length && field.remotely_sync !== true ) ||
	            ( field.doNotUpload === true && claimValue[0] === '' ),
	        claimValue,
	        guid,
	        remoteFlag,
	        wikidataText: claimValue.map( a => a ).join( '\n' ),
	        localText: editorField.map( ( selector ) => $(selector).val() ).join( '\n' )
	    };
	};

	prepareRadio_1 = prepareRadio;
	return prepareRadio_1;
}

var SisterSite;
var hasRequiredSisterSite;

function requireSisterSite () {
	if (hasRequiredSisterSite) return SisterSite;
	hasRequiredSisterSite = 1;
	const { WIKIPEDIA_URL, WIKIDATA_URL, COMMONS_URL,
	    LANG,
	    WIKIDATA_SITELINK_WIKIPEDIA } = globalConfig;
	const { getConfig } = Config;

	SisterSite = function() {
	    const { WIKIDATAID } = getConfig();
	    var API_WIKIDATA = `${WIKIDATA_URL}/w/api.php`;
	    var API_WIKIPEDIA = `${WIKIPEDIA_URL}/w/api.php`;
	    var API_COMMONS = `${COMMONS_URL}/w/api.php`;
	    var WIKIDATA_PROP_WMURL = 'P143'; // Wikimedia import URL
	    var WIKIDATA_PROP_WMPRJ = 'P4656'; // Wikimedia project source of import

	    // perform an ajax query of a sister site
	    const ajaxSisterSiteSearch = function(url, ajaxData ) {
	        return $.ajax({
	            url,
	            data: Object.assign( ajaxData, {
	                format: 'json',
	                origin: '*'
	            } )
	        });
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
	        var api = new mw.ForeignApi( API_WIKIDATA );
	        return api.postWithToken( 'csrf', ajaxData, { async: false } ).then( referenceWikidata ); // async disabled because otherwise get edit conflicts with multiple changes submitted at once
	    };
	    var removeFromWikidata = function(guidObj) {
	        var ajaxData = {
	            action: 'wbremoveclaims',
	            claim: guidObj,
	        };
	        var api = new mw.ForeignApi( API_WIKIDATA );
	        return api.postWithToken( 'csrf', ajaxData, { async: false } );
	    };
	    var changeOnWikidata = function(guidObj, prop, value, snaktype) {
	        var ajaxData = {
	            action: 'wbsetclaimvalue',
	            claim: guidObj,
	            snaktype,
	            value
	        };
	        var ajaxSuccess = function(jsonObj) {
	            const promises = [];
	            if( jsonObj.claim ) {
	                if( !(jsonObj.claim.references) ) { // if no references, add imported from
	                    promises.push(
	                        referenceWikidata(jsonObj)
	                    );
	                }
	                else if ( jsonObj.claim.references.length === 1 ) { // skip if >1 reference; too complex to automatically set
	                    var acceptedProps = [WIKIDATA_PROP_WMURL, WIKIDATA_PROP_WMPRJ]; // properties relating to Wikimedia import only
	                    var diff = $(jsonObj.claim.references[0]['snaks-order']).not(acceptedProps).get(); // x-compatible method for diff on arrays, from https://stackoverflow.com/q/1187518
	                    if( diff.length === 0 ) { // if the set of present properties is a subset of the set of acceptable properties
	                        promises.push(
	                            // then remove the current reference
	                            unreferenceWikidata(jsonObj.claim.id, jsonObj.claim.references[0].hash)
	                        );
	                        promises.push(
	                            // and add imported from
	                            referenceWikidata(jsonObj)
	                        );
	                    }
	                }
	            }
	            return Promise.resolve( promises )
	        };
	        var api = new mw.ForeignApi( API_WIKIDATA );
	        return api.postWithToken( 'csrf', ajaxData, {async: false} ).then( ajaxSuccess );
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
	        return api.postWithToken( 'csrf', ajaxData, { async: false } );
	    };
	    var unreferenceWikidata = function(statement, references) {
	        var ajaxData = {
	            action: 'wbremovereferences',
	            statement,
	            references
	        };
	        var api = new mw.ForeignApi( API_WIKIDATA );
	        return api.postWithToken( 'csrf', ajaxData, { async: false } );
	    };

	    const SEARCH_PARAMS = {
	        action: 'opensearch',
	        list: 'search',
	        limit: 10,
	        redirects: 'resolve'
	    };

	    // expose public members
	    return {
	        SEARCH_PARAMS,
	        API_WIKIDATA,
	        API_WIKIPEDIA,
	        API_COMMONS,
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

var getSyncValues;
var hasRequiredGetSyncValues;

function requireGetSyncValues () {
	if (hasRequiredGetSyncValues) return getSyncValues;
	hasRequiredGetSyncValues = 1;
	const { iata } = requireTemplates();
	const prepareRadio = requirePrepareRadio();
	const trimDecimal = requireTrimDecimal();
	const { getConfig } = Config;
	const { translate } = translate_1;

	getSyncValues = ( jsonObj, wikidataRecord ) => {
	    const SisterSite = requireSisterSite()();
	    const { wikidataClaim, wikidataWikipedia } = SisterSite;
	    const { WIKIDATA_CLAIMS } = getConfig();

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
	        } else if (key === 'email') {
	            if( res[key].value ) {
	                res[key].value = res[key].value.replace('mailto:', '');
	            }
	        } else if (key === 'coords') {
	            if ( res[key].value ) {
	                res[key].value.latitude = trimDecimal(res[key].value.latitude, 6);
	                res[key].value.longitude = trimDecimal(res[key].value.longitude, 6);
	            }
	        }
	    }
	    const syncValues = [];
	    for (let key in res) {
	        const value = res[key].value;
	        const guidObj = res[key].guidObj;
	        if (key === 'coords' && value) {
	            const radio = prepareRadio(
	                WIKIDATA_CLAIMS[key],
	                [ value.latitude, value.longitude],
	                guidObj
	            );
	            if ( !radio.skip ) {
	                syncValues.push(
	                    radio
	                );
	            }
	        } else {
	            const radio = prepareRadio(
	                WIKIDATA_CLAIMS[key],
	                [ value ],
	                guidObj
	            );
	            if ( !radio.skip ) {
	                syncValues.push(
	                    radio
	                );
	            }
	        }
	    }
	    var wikipedia = wikidataWikipedia(jsonObj, wikidataRecord);
	    syncValues.push(
	        prepareRadio(
	            {
	                label: translate( "sharedWikipedia" ),
	                fields: ['wikipedia'],
	                doNotUpload: true,
	                'remotely_sync': true
	            },
	            [wikipedia],
	            $('#input-wikidata-value').val()
	        )
	    );
	    return syncValues;
	};
	return getSyncValues;
}

var launchSyncDialog;
var hasRequiredLaunchSyncDialog;

function requireLaunchSyncDialog () {
	if (hasRequiredLaunchSyncDialog) return launchSyncDialog;
	hasRequiredLaunchSyncDialog = 1;
	const { LANG } = globalConfig;
	const trimDecimal = requireTrimDecimal();
	const dialog = requireDialogs();
	const parseDMS = requireParseDMS();
	const updateFieldIfNotNull = requireUpdateFieldIfNotNull();
	const ListingEditorSyncDialog = requireListingEditorSyncDialog();
	const getSyncValues = requireGetSyncValues();
	const { translate } = translate_1;
	const { getConfig } = Config;
	const SisterSite = requireSisterSite();

	const makeSubmitFunction = function( updateModel, ss, closeFn ) {
	    return ( close ) => {
	        if ( !closeFn ) {
	            closeFn = () => close();
	        }
	        const { WIKIDATA_CLAIMS, LISTING_TEMPLATES } = getConfig();
	        const { API_WIKIDATA, sendToWikidata, changeOnWikidata,
	            removeFromWikidata, ajaxSisterSiteSearch } = ss;

	        $('#listing-editor-sync input[id]:radio:checked').each(function () {
	            var label = $(`label[for="${$(this).attr('id')}"]`);
	            // @todo: Do not rely on label.text for something so important
	            // Switch this to data attribute.
	            var syncedValue = label.text().split('\n');
	            var field = JSON.parse($(this).parents('.choose-row').find('.has-json > input:hidden:not(:radio)').val()); // not radio needed, remotely_synced values use hidden radio buttons
	            var editorField = [];
	            for( var i = 0; i < field.fields.length; i++ ) {
	                editorField[i] = `#${LISTING_TEMPLATES.listing[field.fields[i]].id}`;
	            }
	            var guidObj = $(this).parents('.choose-row').find('.has-guid > input:hidden:not(:radio)').val();

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
	                    updateModel( { wikipedia: syncedValue } );
	                }
	                if( field.p === WIKIDATA_CLAIMS.image.p ) {
	                    updateModel( { commons: syncedValue } );
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
	                } ).then( closeFn );
	            } else {
	                closeFn();
	            }
	        });
	    }
	};

	launchSyncDialog = function (jsonObj, wikidataRecord, updateModel, ss, close ) {
	    const syncValues = getSyncValues(
	        jsonObj, wikidataRecord
	    );
	    const submitFunction = makeSubmitFunction( updateModel, ss || SisterSite(), close );
	    dialog.render( ListingEditorSyncDialog, {
	        title: translate( 'syncTitle' ),
	        syncValues,
	        dialogClass: 'listing-editor-dialog listing-editor-dialog--wikidata-shared',
	        onSubmit: submitFunction
	    }, translate );

	    const $syncDialogElement = $('#listing-editor-sync');
	    if($syncDialogElement.find('.sync_label').length === 0) { // if no choices, close the dialog and display a message
	        submitFunction();
	        alert( translate( 'wikidataSharedMatch' ) );
	    }

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
	return launchSyncDialog;
}

var updateWikidataSharedFields;
var hasRequiredUpdateWikidataSharedFields;

function requireUpdateWikidataSharedFields () {
	if (hasRequiredUpdateWikidataSharedFields) return updateWikidataSharedFields;
	hasRequiredUpdateWikidataSharedFields = 1;
	const { LANG } = globalConfig;

	updateWikidataSharedFields = function(
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
	return updateWikidataSharedFields;
}

var quickUpdateWikidataSharedFields;
var hasRequiredQuickUpdateWikidataSharedFields;

function requireQuickUpdateWikidataSharedFields () {
	if (hasRequiredQuickUpdateWikidataSharedFields) return quickUpdateWikidataSharedFields;
	hasRequiredQuickUpdateWikidataSharedFields = 1;
	const { LANG } = globalConfig;
	const { translate } = translate_1;
	const { iata } = requireTemplates();
	const trimDecimal = requireTrimDecimal();
	const { getConfig } = Config;
	const updateFieldIfNotNull = requireUpdateFieldIfNotNull();

	quickUpdateWikidataSharedFields = function(wikidataRecord, SisterSite) {
	    const { API_WIKIDATA, wikidataClaim, wikidataWikipedia,
	        ajaxSisterSiteSearch } = SisterSite;
	    const { WIKIDATA_CLAIMS, LISTING_TEMPLATES } = getConfig();
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
	    return ajaxSisterSiteSearch(API_WIKIDATA, ajaxData ).then(  ajaxSuccess );
	};
	return quickUpdateWikidataSharedFields;
}

var SisterSites;
var hasRequiredSisterSites;

function requireSisterSites () {
	if (hasRequiredSisterSites) return SisterSites;
	hasRequiredSisterSites = 1;
	const mapSearchResult = requireMapSearchResult();
	const getWikidataFromWikipedia = requireGetWikidataFromWikipedia();
	const launchSyncDialog = requireLaunchSyncDialog();
	const updateWikidataSharedFields = requireUpdateWikidataSharedFields();
	const quickUpdateWikidataSharedFields = requireQuickUpdateWikidataSharedFields();
	const { WIKIPEDIA_URL, WIKIDATA_URL, COMMONS_URL,
	    LANG } = globalConfig;
	const { ref, computed, nextTick } = require$$2$1;
	const { translate } = translate_1;
	const { CdxLookup } = require$$0$1;

	SisterSites = {
	    props: {
	        api: {
	            type: Object
	        },
	        wikipedia: {
	            type: String,
	            default: ''
	        },
	        wikidata: {
	            type: String,
	            default: ''
	        },
	        image: {
	            type: String,
	            default: ''
	        }
	    },
	    components: {
	        CdxLookup
	    },
	    template: `<div id="div_wikidata" class="editor-row">
<div class="editor-label-col">
    <label for="input-wikidata-label">Wikidata</label>
</div>
<div>
    <cdx-lookup
        v-model:selected="wikidata"
        v-model:input-value="wikidataInput"
        :menu-items="wikidataMenuItems"
        @blur="onBlur"
        @update:input-value="onWikidataInput"
        @update:selected="onWikidataSelected"
        :placeholder="$translate('placeholder-wikidata-label' )"
        id="input-wikidata-label"
    >
        <template #no-results>
            No results found.
        </template>
    </cdx-lookup>
    <input type="hidden" id="input-wikidata-value" :value="wikidata">
    <a v-if="wikipedia"
        id="wp-wd" @click="onWPClick"
        :title="$translate( 'wpWd' )"
    ><small>&#160;WP</small></a>
    <span v-if="wikidata" id="wikidata-value-display-container">
        <small>&#160;
            <span id="wikidata-value-link">
                <a v-if="wikidata"
                    target="_new" :href="wikidataUrl"
                    :title="$translate( 'viewWikidataPage' )">{{ wikidata }}</a>
            </span>
        &#160;|&#160;<a v-if="wikidata"
            id="wikidata-remove"
            @click="clickClearWikidata"
            :title="$translate( 'wikidataRemoveTitle' )">{{ $translate( 'wikidataRemoveLabel' ) }}</a>
        </small>
    </span>
</div>
</div>
<div v-if="wikidata" id="div_wikidata_update">
<div class="editor-label-col">&#160;</div>
<div>
    <span class="wikidata-update"></span>
    <a id="wikidata-shared" @click="clickSync">{{ $translate( 'syncWikidata' ) }}</a>
    <small>&nbsp;<a
        :title="$translate( 'syncWikidataTitle' )"
        class="listing-tooltip"
        @click="wikidataQuickSync"
        id="wikidata-shared-quick">{{ $translate( 'syncWikidataLabel' ) }}</a>
    </small>
</div>
</div>
<div id="div_wikipedia" class="editor-row">
<div class="editor-label-col">
    <label for="input-wikipedia">Wikipedia<span class="wikidata-update"></span></label>
</div>
<div>
    <cdx-lookup
        @blur="onBlur"
        v-model:selected="wikipedia"
        v-model:input-value="wikipediaInput"
        :menu-items="wikipediaMenuItems"
        :placeholder="$translate( 'placeholder-wikipedia' )"
        @update:input-value="onWikipediaInput"
        @update:selected="onWikipediaSelected"
        id="input-wikipedia"
    ></cdx-lookup>
    <span v-if="wikipedia" id="wikipedia-value-display-container">
        <small>&#160;<span id="wikipedia-value-link">
            <a
                target="_new" :href="wikipediaUrl"
                :title="$translate( 'viewWikipediaPage' )">{{ $translate( 'viewWikipediaPage' ) }}</a>
        </span>
        </small>
    </span>
</div>
</div>
<div id="div_image" class="editor-row">
<div class="editor-label-col">
    <label for="input-image">{{ $translate( 'image' ) }}<span class="wikidata-update"></span></label>
</div>
<div>
    <cdx-lookup
        @blur="onBlur"
        v-model:selected="commons"
        v-model:input-value="commonsInput"
        :menu-items="commonsMenuItems"
        :placeholder="$translate( 'placeholder-image' )"
        @update:input-value="onCommonsInput"
        @update:selected="onCommonsSelected"
        id="input-image"
    ></cdx-lookup>
    <span v-if="commons" id="image-value-display-container">
        <small>&#160;<span id="image-value-link">
            <a
                target="_new" :href="commonsUrl"
                :title="$translate( 'viewCommonsPage' )">{{ $translate( 'viewCommonsPage' ) }}</a>
        </span></small>
    </span>
</div>
</div>`,
	    emits: [ 'updated:listing' ],
	    setup( { wikipedia, wikidata, image, api }, { emit } ) {
	        const SisterSite = api || requireSisterSite()();
	        const { SEARCH_PARAMS,
	            API_WIKIDATA, API_COMMONS, API_WIKIPEDIA,
	            ajaxSisterSiteSearch } = SisterSite;
	        wikipedia = ref( wikipedia );
	        wikidata = ref( wikidata );
	        const commons = ref( image || '' );
	        const wikidataInput = ref( wikidata.value );
	        const wikipediaInput = ref( wikipedia.value );
	        const commonsInput = ref( commons.value );
	        const wikidataMenuItems = ref( [] );
	        const commonsMenuItems = ref( [] );
	        const wikipediaMenuItems = ref( [] );

	        const wikidataUrl = computed(
	            () => `${WIKIDATA_URL}/wiki/${mw.util.wikiUrlencode(wikidata.value)}`
	        );
	        const wikipediaUrl = computed(
	            () => `${WIKIPEDIA_URL}/wiki/${mw.util.wikiUrlencode(wikipedia.value)}`,
	        );
	        const commonsUrl = computed(
	            () => `${COMMONS_URL}/wiki/${mw.util.wikiUrlencode(`File:${commons.value}`)}`
	        );

	        const clickClearWikidata = () => {
	            wikidata.value = '';
	            wikidataInput.value = '';
	        };

	        const updateModel = ( newValues ) => {
	            nextTick( () => {
	                if ( newValues.commons ) {
	                    commons.value = newValues.commons;
	                    nextTick( () => {
	                        commonsInput.value = newValues.commons;
	                    } );
	                }
	                if ( newValues.wikipedia ) {
	                    wikipedia.value = newValues.wikipedia;
	                    nextTick( () => {
	                        wikipediaInput.value = newValues.wikipedia;
	                    } );
	                }
	            } );
	        };

	        const wikidataQuickSync = () => {
	            if ( !wikidata.value ) {
	                return;
	            }
	            quickUpdateWikidataSharedFields(wikidata.value, SisterSite)
	                .then( ( result ) => {
	                    if ( result.commons || result.wikipedia ) {
	                        updateModel( result );
	                    } else {
	                        alert( translate( 'wikidataSharedNotFound' ) );
	                    }
	                } );
	        };

	        const clickSync = () => {
	            const wikidataRecord = wikidata.value;
	            updateWikidataSharedFields(
	                wikidataRecord, SisterSite
	            ).then(( jsonObj ) => {
	                launchSyncDialog(
	                    jsonObj, wikidataRecord, updateModel
	                );
	            });
	        };

	        const onWPClick = function() {
	                getWikidataFromWikipedia(
	                    wikipedia.value,
	                    SisterSite
	                ).then( ( wikidataID ) => {
	                    nextTick( () => {
	                        wikidata.value = wikidataID;
	                        wikidataInput.value = wikidataID;
	                    } );
	                });
	            };

	        const onBlur = () => {
	            emitUpdatedEvent();
	        };

	        const emitUpdatedEvent = () => {
	            emit( 'updated:listing', {
	                image: commonsInput.value,
	                wikipedia: wikipediaInput.value,
	                wikidata: wikidataInput.value
	            } );
	        };

	        function onWikidataSelected( selected ) {
	            if ( selected ) {
	                wikidataInput.value = selected;
	                emitUpdatedEvent();
	            }
	        }
	        function onWikidataInput( search ) {
	            if ( !search ) {
	                wikidataMenuItems.value = [];
	                return;
	            }
	            ajaxSisterSiteSearch(
	                API_WIKIDATA,
	                {
	                    action: 'wbsearchentities',
	                    search,
	                    language: LANG
	                }
	            ).then( (  jsonObj ) => {
	                wikidataMenuItems.value = ( jsonObj.search || [] ).map(
	                    ( { title, label } ) => ( { value: title, label } )
	                );
	            } );
	        }

	        function onCommonsSelected( selected ) {
	            if ( selected ) {
	                commonsInput.value = selected;
	                emitUpdatedEvent();
	            }
	        }

	        function onCommonsInput( search ) {
	            ajaxSisterSiteSearch(
	                API_COMMONS,
	                Object.assign( {}, SEARCH_PARAMS, {
	                    search,
	                    namespace: 6
	                } )
	            ).then( (  jsonObj ) => {
	                commonsMenuItems.value = mapSearchResult( jsonObj );
	            } );
	        }

	        function onWikipediaSelected( selected ) {
	            if ( selected ) {
	                wikipediaInput.value = selected;
	                emitUpdatedEvent();
	            }
	        }

	        function onWikipediaInput( search ) {
	            ajaxSisterSiteSearch(
	                API_WIKIPEDIA,
	                Object.assign( {}, SEARCH_PARAMS, {
	                    search,
	                    namespace: 0
	                } )
	            ).then( (  jsonObj ) => {
	                wikipediaMenuItems.value = mapSearchResult( jsonObj );
	            } );
	        }

	        return {
	            onBlur,
	            onCommonsSelected,
	            onWikipediaSelected,
	            onWikidataSelected,
	            clickSync,
	            wikidataQuickSync,
	            clickClearWikidata,
	            onWPClick,
	            commonsMenuItems,
	            wikipediaMenuItems,
	            wikidataMenuItems,
	            wikidata,
	            wikidataUrl,
	            commonsUrl,
	            wikipediaUrl,
	            wikidataInput,
	            commonsInput,
	            wikipediaInput,
	            onWikidataInput,
	            onWikipediaInput,
	            onCommonsInput,
	            wikipedia,
	            commons
	        }
	    }
	};
	return SisterSites;
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

var TelephoneCharInsert;
var hasRequiredTelephoneCharInsert;

function requireTelephoneCharInsert () {
	if (hasRequiredTelephoneCharInsert) return TelephoneCharInsert;
	hasRequiredTelephoneCharInsert = 1;
	TelephoneCharInsert = {
	    name: 'TelephoneCharInsert',
	    props: {
	        updates: {
	            type: String
	        },
	        codes: {
	            type: Array
	        }
	    },
	    template: `<div class="input-cc" :data-for="updates">
    <span v-for="(code, i) in codes"
        class="listing-charinsert" :data-for="updates"><a>{{ code }}</a>&nbsp;</span>
</div>`
	};
	return TelephoneCharInsert;
}

var specialCharactersString;
var hasRequiredSpecialCharactersString;

function requireSpecialCharactersString () {
	if (hasRequiredSpecialCharactersString) return specialCharactersString;
	hasRequiredSpecialCharactersString = 1;
	specialCharactersString = {
	    name: 'SpecialCharactersString',
	    props: {
	        characters: {
	            type: Array
	        }
	    },
	    template: `<span v-if="characters.length">
    <br />(<span
    v-for="(char, i) in characters"
    class="listing-charinsert"
    data-for="input-content"><a>{{ char }}</a>&nbsp;</span>
&nbsp;)</span><span v-else></span>`
	};
	return specialCharactersString;
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

var createListingFromForm_1;
var hasRequiredCreateListingFromForm;

function requireCreateListingFromForm () {
	if (hasRequiredCreateListingFromForm) return createListingFromForm_1;
	hasRequiredCreateListingFromForm = 1;
	const getListingInfo = requireGetListingInfo();
	const { getConfig } = Config;

	const createListingFromForm = ( listing ) => {
	    const {
	        LISTING_TYPE_PARAMETER,
	        DEFAULT_LISTING_TEMPLATE
	    } = getConfig();
	    var defaultListingParameters = getListingInfo(DEFAULT_LISTING_TEMPLATE);
	    var listingTypeInput = defaultListingParameters[LISTING_TYPE_PARAMETER].id;
	    var listingType = $(`#${listingTypeInput}`).val();
	    var listingParameters = getListingInfo(listingType);
	    for (var parameter in listingParameters) {
	        listing[parameter] = $(`#${listingParameters[parameter].id}`).val();
	    }
	    return listing;
	};

	createListingFromForm_1 = createListingFromForm;
	return createListingFromForm_1;
}

var showPreview_1;
var hasRequiredShowPreview;

function requireShowPreview () {
	if (hasRequiredShowPreview) return showPreview_1;
	hasRequiredShowPreview = 1;
	const listingToStr = requireListingToStr();
	const createListingFromForm = requireCreateListingFromForm();

	const showPreview = function(listingTemplateAsMap) {
	    var listing = createListingFromForm( listingTemplateAsMap );
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

	showPreview_1 = showPreview;
	return showPreview_1;
}

/**
 * Return the current date in the format "2015-01-15".
 */

var currentLastEditDate_1;
var hasRequiredCurrentLastEditDate;

function requireCurrentLastEditDate () {
	if (hasRequiredCurrentLastEditDate) return currentLastEditDate_1;
	hasRequiredCurrentLastEditDate = 1;
	const currentLastEditDate = function() {
	    var d = new Date();
	    var year = d.getFullYear();
	    // Date.getMonth() returns 0-11
	    var month = d.getMonth() + 1;
	    if (month < 10) month = `0${month}`;
	    var day = d.getDate();
	    if (day < 10) day = `0${day}`;
	    return `${year}-${month}-${day}`;
	};
	currentLastEditDate_1 = currentLastEditDate;
	return currentLastEditDate_1;
}

var isRTLString_1;
var hasRequiredIsRTLString;

function requireIsRTLString () {
	if (hasRequiredIsRTLString) return isRTLString_1;
	hasRequiredIsRTLString = 1;
	const isRTLString = function (s){ // based on https://stackoverflow.com/questions/12006095/javascript-how-to-check-if-character-is-rtl
		var ltrChars = 'A-Za-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02B8\u0300-\u0590\u0800-\u1FFF\u2C00-\uFB1C\uFDFE-\uFE6F\uFEFD-\uFFFF',
		rtlChars = '\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC',
		// eslint-disable-next-line no-misleading-character-class
		rtlDirCheck = new RegExp(`^[^${ltrChars}]*[${rtlChars}]`);
		return rtlDirCheck.test(s);
	};

	isRTLString_1 = isRTLString;
	return isRTLString_1;
}

var asyncGetColor_1;
var hasRequiredAsyncGetColor;

function requireAsyncGetColor () {
	if (hasRequiredAsyncGetColor) return asyncGetColor_1;
	hasRequiredAsyncGetColor = 1;
	const asyncGetColor = ( listingType ) => {
	    const colorKey = `listingeditor-color-${listingType}`;
	    const cachedColor = mw.storage.get(colorKey);
	    if ( cachedColor ) {
	        return $.Deferred().resolve( cachedColor )
	    }
	    return $.ajax ({
	        listingType,
	        url: `${mw.config.get('wgScriptPath')}/api.php?${$.param({
	            action: 'parse',
	            prop: 'text',
	            contentmodel: 'wikitext',
	            format: 'json',
	            disablelimitreport: true,
	            'text': `{{#invoke:TypeToColor|convert|${listingType}}}`,
	        })}`
	    }).then( ( data ) => {
	        let color = $(data.parse.text['*']).text().trim();
	        if ( color ) {
	            color = `#${color}`;
	        }
	        mw.storage.set( colorKey, color );
	        return color;
	    } );
	};
	asyncGetColor_1 = asyncGetColor;
	return asyncGetColor_1;
}

var typeToColor_1;
var hasRequiredTypeToColor;

function requireTypeToColor () {
	if (hasRequiredTypeToColor) return typeToColor_1;
	hasRequiredTypeToColor = 1;
	const asyncGetColor = requireAsyncGetColor();
	const changeColor = function(color, form) {
	    $('#input-type', form).css( 'box-shadow', `-20px 0 0 0 ${color} inset` );
	};

	const typeToColor = function(listingType, form) {
	    changeColor( 'var(--background-color-base, white)', form );
	    return asyncGetColor( listingType ).then(( color ) => {
	        changeColor(color, form);
	    });
	};
	typeToColor_1 = typeToColor;
	return typeToColor_1;
}

var initColor_1;
var hasRequiredInitColor;

function requireInitColor () {
	if (hasRequiredInitColor) return initColor_1;
	hasRequiredInitColor = 1;
	const typeToColor = requireTypeToColor();
	const initColor = function(form) {
	    typeToColor( $('#input-type', form).val(), form );
	    $('#input-type', form).on('change', function () {
	        typeToColor(this.value, form);
	    });
	};

	initColor_1 = initColor;
	return initColor_1;
}

/**
 * Add listeners to specific strings so that clicking on a string
 * will insert it into the associated input.
 */

var initStringFormFields_1;
var hasRequiredInitStringFormFields;

function requireInitStringFormFields () {
	if (hasRequiredInitStringFormFields) return initStringFormFields_1;
	hasRequiredInitStringFormFields = 1;
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

	initStringFormFields_1 = initStringFormFields;
	return initStringFormFields_1;
}

var ListingEditorForm;
var hasRequiredListingEditorForm;

function requireListingEditorForm () {
	if (hasRequiredListingEditorForm) return ListingEditorForm;
	hasRequiredListingEditorForm = 1;
	const { CdxTextInput, CdxTextArea, CdxTabs, CdxTab } = require$$0$1;
	const sistersites = requireSisterSites();
	const { onMounted, ref, computed } = require$$2$1;
	const { MODE_ADD } = requireMode();
	const getListingInfo = requireGetListingInfo();
	const TelephoneCharInsert = requireTelephoneCharInsert();
	const SpecialCharactersString = requireSpecialCharactersString();
	const parseDMS = requireParseDMS();
	const showPreview = requireShowPreview();
	const currentLastEditDate = requireCurrentLastEditDate();
	const isRTLString = requireIsRTLString();
	const initColor = requireInitColor();
	const initStringFormFields = requireInitStringFormFields();

	/**
	 * Generate the form UI for the listing editor. If editing an existing
	 * listing, pre-populate the form input fields with the existing values.
	 */
	const hideEmptyFormValues = ( form, listingParameters ) => {
	    for (var parameter in listingParameters) {
	        var parameterInfo = listingParameters[parameter];
	        if (parameterInfo.hideDivIfEmpty) {
	            const $element = $(`#${parameterInfo.hideDivIfEmpty}`, form);
	            if ( !$element.find( 'input,select' ).val() ) {
	                $element.hide();
	            }
	        }
	    }
	};

	ListingEditorForm = {
	    name: 'ListingEditorForm',
	    props: {
	        aka: {
	            type: String
	        },
	        address: {
	            type: String
	        },
	        email: {
	            type: String
	        },
	        directions: {
	            type: String
	        },
	        phone: {
	            type: String
	        },
	        tollfree: {
	            type: String
	        },
	        fax: {
	            type: String
	        },
	        hours: {
	            type: String
	        },
	        checkin: {
	            type: String
	        },
	        checkout: {
	            type: String
	        },
	        price: {
	            type: String
	        },
	        lat: {
	            type: String
	        },
	        long: {
	            type: String
	        },
	        url: {
	            type: String
	        },
	        content: {
	            type: String
	        },
	        lastedit: {
	            type: String
	        },
	        listingName: {
	            type: String
	        },
	        listingTypes: {
	            type: Array
	        },
	        wikipedia: {
	            type: String
	        },
	        wikidata: {
	            type: String
	        },
	        image: {
	            type: String
	        },
	        mode: {
	            type: String
	        },
	        telephoneCodes: {
	            type: Array
	        },
	        nationalCurrencies: {
	            type: Array
	        },
	        showLastEditedField: {
	            type: Boolean
	        },
	        currencies: {
	            type: Array,
	            default: [ '€', '$', '£', '¥', '₩' ]
	        },
	        characters: {
	            type: Array
	        },
	        listingType: {
	            type: String
	        }
	    },
	    template: `<cdx-tabs :framed="true" :active="currentTab" @update:active="onUpdateTab">
<cdx-tab
    v-for="( tab, index ) in tabsData"
    :key="index"
    :name="tab.name"
    :label="tab.label"
>
<form id="listing-editor" ref="form">
    <template v-if="tab.name === 'edit'">
        <div class="listing-col">
            <div class="editor-fullwidth">
            <div id="div_name" class="editor-row">
                <div class="editor-label-col"><label for="input-name">{{ $translate( 'name' ) }}</label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-name"
                    :placeholder="$translate('placeholder-name' )"
                    @input="onListingUpdate"
                    v-model="currentListingName"
                    :modelValue="listingName"></cdx-text-input></div>
            </div>
            <div id="div_alt" class="editor-row">
                <div class="editor-label-col"><label for="input-alt">{{ $translate( 'alt' ) }}</label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-alt"
                    :dir="computedAltDir"
                    :placeholder="$translate('placeholder-alt' )"
                    @input="onListingUpdate"
                    v-model="currentAltName"
                    :modelValue="aka"></cdx-text-input></div>
            </div>
            <div id="div_address" class="editor-row">
                <div class="editor-label-col"><label for="input-address">{{ $translate( 'address' ) }}</label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-address"
                    :placeholder="$translate('placeholder-address' )"
                    @input="onListingUpdate"
                    v-model="currentAddress"
                    :modelValue="address"></cdx-text-input></div>
            </div>
            <div id="div_directions" class="editor-row">
                <div class="editor-label-col"><label for="input-directions">{{ $translate( 'directions' ) }}</label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-directions"
                    :placeholder="$translate('placeholder-directions' )"
                    :modelValue="directions"></cdx-text-input></div>
            </div>
            <div id="div_phone" class="editor-row">
                <div class="editor-label-col"><label for="input-phone">{{ $translate( 'phone' ) }}</label></div>
                <div class="editor-fullwidth">
                    <cdx-text-input class="editor-fullwidth" id="input-phone"
                        :placeholder="$translate('placeholder-phone' )"
                        :modelValue="phone"></cdx-text-input>
                    <telephone-char-insert updates="input-phone"
                        :codes="telephoneCodes"></telephone-char-insert>
                </div>
            </div>
            <div id="div_tollfree" class="editor-row">
                <div class="editor-label-col">
                    <label for="input-tollfree">{{ $translate( 'tollfree' ) }}</label>
                </div>
                <div class="editor-fullwidth">
                    <cdx-text-input class="editor-fullwidth" id="input-tollfree"
                        :placeholder="$translate('placeholder-tollfree' )"
                        :modelValue="tollfree"></cdx-text-input>
                    <telephone-char-insert updates="input-tollfree"
                    
                        :codes="telephoneCodes"></telephone-char-insert>
                </div>
            </div>
            <div id="div_fax" class="editor-row">
                <div class="editor-label-col"><label for="input-fax">{{ $translate( 'fax' ) }}</label></div>
                <div class="editor-fullwidth">
                    <cdx-text-input class="editor-fullwidth" id="input-fax"
                        :placeholder="$translate('placeholder-fax' )"
                        :modelValue="fax"></cdx-text-input>
                    <telephone-char-insert updates="input-fax"
                        :codes="telephoneCodes"></telephone-char-insert>
                </div>
            </div>
            <div id="div_hours" class="editor-row">
                <div class="editor-label-col"><label for="input-hours">{{ $translate( 'hours' ) }}</label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-hours"
                    :placeholder="$translate('placeholder-hours' )"
                    :modelValue="hours"></cdx-text-input></div>
            </div>
            <div id="div_checkin" class="editor-row">
                <div class="editor-label-col"><label for="input-checkin">{{ $translate( 'checkin' ) }}</label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-checkin"
                    :placeholder="$translate('placeholder-checkin' )"
                    :modelValue="checkin"></cdx-text-input></div>
            </div>
            <div id="div_checkout" class="editor-row">
                <div class="editor-label-col">
                    <label for="input-checkout">{{ $translate( 'checkout' ) }}</label>
                </div>
                <div><cdx-text-input class="editor-fullwidth" id="input-checkout"
                    :placeholder="$translate('placeholder-checkout' )"
                    :modelValue="checkout"></cdx-text-input></div>
            </div>
            <div id="div_price" class="editor-row">
                <div class="editor-label-col"><label for="input-price">{{ $translate( 'price' ) }}</label></div>
                <!-- update the Callbacks.initStringFormFields
                    method if the currency symbols are removed or modified -->
                <div class="editor-fullwidth">
                    <cdx-text-input class="editor-fullwidth" id="input-price"
                        :placeholder="$translate('placeholder-price' )"
                         :modelValue="price"></cdx-text-input>
                    <div class="input-price">
                        <span id="span_natl_currency"
                            :title="$translate( 'natlCurrencyTitle' )">
                            <span v-for="(currency, i) in nationalCurrencies"
                                class="listing-charinsert" data-for="input-price">&nbsp;<a href="javascript:">{{ currency }}</a></span>
                            <span v-if="currencies.length"> |</span>
                        </span>
                        <span id="span_intl_currencies" :title="$translate( 'intlCurrenciesTitle' )">
                            <span v-for="(currency, i) in currencies"
                                class="listing-charinsert"
                                data-for="input-price"><a href="javascript:">{{ currency }}</a>&nbsp;</span>
                        </span>
                    </div>
                </div>
            </div>
            <div id="div_lastedit" style="display: none;">
                <div class="editor-label-col">
                    <label for="input-lastedit">{{ $translate( 'lastUpdated' ) }}</label>
                </div>
                <div><cdx-text-input size="10" id="input-lastedit"
                    v-model="lastEditTimestamp"
                    :placeholder="$translate('placeholder-lastedit' )"
                    :modelValue="lastedit"></cdx-text-input></div>
            </div>
            </div>
        </div>
        <div class="listing-col">
            <div class="editor-fullwidth">
            <div id="div_type" class="editor-row">
                <div class="editor-label-col">
                    <label for="input-type">{{ $translate( 'type' ) }}</label>
                </div>
                <div>
                    <select id="input-type">
                        <option v-for="t in listingTypes"
                            :value="t" :selected="listingType === t">{{ t }}</option>
                    </select>
                </div>
                <div class="editor-fullwidth">
                    <span id="span-closed">
                        <input type="checkbox" id="input-closed">
                        <label for="input-closed"
                            class="listing-tooltip"
                            :title="$translate( 'listingTooltip' )">{{ $translate( 'listingLabel' ) }}</label>
                    </span>
                </div>
            </div>
            <div id="div_url" class="editor-row">
                <div class="editor-label-col">
                    <label for="input-url">{{ $translate( 'website' ) }}<span class="wikidata-update"></span></label>
                </div>
                <div><cdx-text-input class="editor-fullwidth" id="input-url"
                    :placeholder="$translate('placeholder-url' )"
                    :modelValue="url"></cdx-text-input></div>
            </div>
            <div id="div_email" class="editor-row">
                <div class="editor-label-col"><label for="input-email">{{ $translate( 'email' ) }}<span class="wikidata-update"></span></label></div>
                <div><cdx-text-input class="editor-fullwidth" id="input-email"
                    :placeholder="$translate('placeholder-email' )"
                    @input="onListingUpdate"
                    v-model="currentEmail"
                    :modelValue="email"></cdx-text-input></div>
            </div>
            <div id="div_lat" class="editor-row">
                <div class="editor-label-col">
                    <label for="input-lat">{{ $translate( 'latitude' ) }}<span class="wikidata-update"></span></label>
                </div>
                <div>
                    <cdx-text-input class="editor-partialwidth" id="input-lat"
                        :placeholder="$translate('placeholder-lat' )"
                        v-model="currentLat"
                        @input="onListingUpdate"
                        :modelValue="lat"
                    ></cdx-text-input>
                    <!-- update the Callbacks.initFindOnMapLink
                    method if this field is removed or modified -->
                    <div class="input-other">
                        <a id="geomap-link"
                            target="_blank"
                            :href="mapLink">
                                {{ $translate( 'findOnMap' ) }}</a>
                    </div>
                </div>
            </div>
            <div id="div_long" class="editor-row">
                <div class="editor-label-col">
                    <label for="input-long">{{ $translate( 'longitude' ) }}<span class="wikidata-update"></span></label>
                </div>
                <div>
                    <cdx-text-input class="editor-partialwidth" id="input-long"
                        :placeholder="$translate('placeholder-long' )"
                        v-model="currentLong"
                        @input="onListingUpdate"
                        :modelValue="long"
                    ></cdx-text-input>
                </div>
            </div>
            <sistersites :wikidata="currentWikidata" :wikipedia="currentWikipedia" :image="currentImage"
                @updated:listing="onSisterSiteUpdate"></sistersites>
            </div>
        </div>
        <div id="div_content" class="editor-row">
            <div class="editor-label-col"><label for="input-content">{{ $translate( 'content' ) }}
            <special-characters-string :characters="characters">
    </special-characters-string></label></div>
            <div><cdx-text-area rows="8" class="editor-fullwidth"
                :placeholder="$translate('placeholder-content' )"
                id="input-content" :modelValue="content"></cdx-text-area></div>
        </div>
        <!-- update the Callbacks.hideEditOnlyFields method if
        the status row is removed or modified -->
        <div id="div_status" class="editor-fullwidth" v-if="showLastEditedField">
            <div class="editor-label-col"><label>Status</label></div>
            <div>
                <span id="span-last-edit">
                    <input type="checkbox" id="input-last-edit"
                        v-model="shouldUpdateTimestamp"
                        :value="lastedit" />
                    <label for="input-last-edit" class="listing-tooltip"
                        :title="$translate( 'listingUpdatedTooltip' )">
                        {{ $translate( 'listingUpdatedLabel' ) }}
                    </label>
                </span>
            </div>
        </div>
        <! -- update the Callbacks.hideEditOnlyFields method if
            the summary table is removed or modified -->
        <div id="div_summary" class="editor-fullwidth">
            <div class="listing-divider"></div>
            <div class="editor-row">
                <div class="editor-label-col"><label for="input-summary">{{ $translate( 'editSummary' ) }}</label></div>
                <div>
                    <cdx-text-input class="editor-partialwidth" id="input-summary"
                        :placeholder="$translate('placeholder-summary' )"></cdx-text-input>
                    <span id="span-minor">
                        <input type="checkbox" id="input-minor">
                            <label for="input-minor" class="listing-tooltip"
                                :title="$translate( 'minorTitle' )">{{ $translate( 'minorLabel' ) }}</label>
                    </span>
                </div>
            </div>
        </div>
    </template>
    <template v-if="tab.name === 'preview'">
        <div id="listing-preview">
            <div class="listing-divider"></div>
            <div class="editor-row">
                <div title="Preview">{{ $translate( 'preview' ) }}</div>
                <div id="listing-preview-text"></div>
            </div>
        </div>
    </template>
    </form>
    </cdx-tab>
</cdx-tabs>`,
	    components: {
	        CdxTabs,
	        CdxTab,
	        TelephoneCharInsert,
	        CdxTextInput,
	        CdxTextArea,
	        SpecialCharactersString,
	        sistersites
	    },
	    emits: [ 'updated:listing' ],
	    setup( props, { emit } ) {
	        const { showLastEditedField, mode, listingType, lat, long, lastedit,
	            email,
	            wikidata, wikipedia, image,
	            aka, address, listingName
	        } = props;
	        const nowTimestamp = currentLastEditDate();
	        const shouldUpdateTimestamp = ref( mode === MODE_ADD );
	        const lastEditTimestamp = computed( () => shouldUpdateTimestamp.value ? nowTimestamp : lastedit );
	        const currentAltName = ref( aka );
	        const currentAddress = ref( address );
	        const currentListingName = ref( listingName );
	        const computedAltDir = computed( () => isRTLString( currentAltName.value ) ? 'rtl' : 'ltr' );
	        const currentLong = ref( long );
	        const currentLat = ref( lat );
	        const currentEmail = ref( email );
	        const listingParameters = getListingInfo(listingType);
	        const mapLink = computed( () => {
	            const la = currentLat.value;
	            const ln = currentLong.value;
	            const base = 'https://wikivoyage.toolforge.org/w/geomap.php';
	            return la && ln ? `${base}?lat=${parseDMS(la)}&lon=${parseDMS(ln)}&zoom=15` : base;
	        } );
	        const tabsData = ref( [
	            {
	                name: 'edit',
	                label: 'edit'
	            }, {
	                name: 'preview',
	                label: 'preview'
	            }
	        ] );
	        const form = ref(null);
	        onMounted( () => {
	            if ( form.value ) {
	                hideEmptyFormValues( form.value, listingParameters );
	                initColor( form.value, mode );
	                initStringFormFields( form.value, mode );
	            }
	        } );

	        let previewTimeout;
	        const currentTab = ref( 'edit' );
	        const onUpdateTab = ( activeTab ) => {
	            if ( activeTab === 'preview' ) {
	                clearInterval( previewTimeout );
	                mw.util.throttle( () => {
	                    previewTimeout = setTimeout( () => {
	                        showPreview( {} );
	                    currentTab.value = activeTab;
	                    }, 200 );
	                }, 300 )();
	            } else {
	                currentTab.value = activeTab;
	            }
	        };

	        const currentWikidata = ref( wikidata );
	        const currentWikipedia = ref( wikipedia );
	        const currentImage = ref( image );
	        const onListingUpdate = () => {
	            emit( 'updated:listing', {
	                lat: currentLat.value,
	                long: currentLong.value,
	                alt: currentAltName.value,
	                name: currentListingName.value,
	                address: currentAddress.value,
	                email: currentEmail.value,
	                wikipedia: currentWikipedia.value,
	                wikidata: currentWikidata.value,
	                image: currentImage.value
	            } );
	        };
	        const onSisterSiteUpdate = ( sisterSiteData ) => {
	            currentWikipedia.value = sisterSiteData.wikipedia;
	            currentWikidata.value = sisterSiteData.wikidata;
	            currentImage.value = sisterSiteData.image;
	            onListingUpdate();
	        };

	        return {
	            currentImage,
	            currentWikidata,
	            currentWikipedia,
	            onSisterSiteUpdate,
	            onListingUpdate,
	            computedAltDir,
	            shouldUpdateTimestamp,
	            currentListingName,
	            currentAltName,
	            currentAddress,
	            currentTab,
	            currentLat,
	            currentLong,
	            currentEmail,
	            mapLink,
	            tabsData,
	            onUpdateTab,
	            form,
	            lastEditTimestamp,
	            showLastEditedField
	        };
	    }
	};
	return ListingEditorForm;
}

var email;
var hasRequiredEmail;

function requireEmail () {
	if (hasRequiredEmail) return email;
	hasRequiredEmail = 1;
	const { getConfig } = Config;
	/**
	 * Implement SIMPLE validation on email addresses. Invalid emails can
	 * still get through, but this method implements a minimal amount of
	 * validation in order to catch the worst offenders.
	 * Disabled for now, TODO: multiple email support.
	 */
	email = function( fieldValue ) {
	    const { VALIDATE_CALLBACKS_EMAIL } = getConfig();
	    if ( VALIDATE_CALLBACKS_EMAIL ) {
	        const VALID_EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
	        return fieldValue !== '' && !VALID_EMAIL_REGEX.test(fieldValue) ?
	            false : true;
	    } else {
	        return true;
	    }
	};
	return email;
}

/**
 * Implement SIMPLE validation on Wikipedia field to verify that the
 * user is entering the article title and not a URL.
 */

var wikipedia;
var hasRequiredWikipedia;

function requireWikipedia () {
	if (hasRequiredWikipedia) return wikipedia;
	hasRequiredWikipedia = 1;
	wikipedia = function( fieldValue ) {
	    const VALID_WIKIPEDIA_REGEX = new RegExp('^(?!https?://)', 'i');
	    return !( fieldValue !== '' && !VALID_WIKIPEDIA_REGEX.test(fieldValue) );
	};
	return wikipedia;
}

var image;
var hasRequiredImage;

function requireImage () {
	if (hasRequiredImage) return image;
	hasRequiredImage = 1;
	const { translate } = translate_1;

	/**
	 * Implement SIMPLE validation on the Commons field to verify that the
	 * user has not included a "File" or "Image" namespace.
	 */
	image = function(fieldValue) {
	    const VALID_IMAGE_REGEX = new RegExp(`^(?!(file|image|${translate( 'image' )}):)`, 'i');
	    return !( fieldValue !== '' && !VALID_IMAGE_REGEX.test(fieldValue) );
	};
	return image;
}

/**
 * @param {string} latInput
 * @param {string} longInput
 * @return {boolean}
 */

var coords;
var hasRequiredCoords;

function requireCoords () {
	if (hasRequiredCoords) return coords;
	hasRequiredCoords = 1;
	const validateCoords = ( latInput, longInput ) => {
	    if ( latInput && longInput ) {
	        const lat = Number( latInput );
	        const long = Number( longInput );
	        if ( isNaN( lat ) || isNaN( long ) ) {
	            return false;
	        }
	    } else if ( latInput && !longInput ) {
	        return false;
	    } else if ( !latInput && longInput ) {
	        return false;
	    }
	    return true;
	};

	coords = validateCoords;
	return coords;
}

var ListingEditorFormDialog;
var hasRequiredListingEditorFormDialog;

function requireListingEditorFormDialog () {
	if (hasRequiredListingEditorFormDialog) return ListingEditorFormDialog;
	hasRequiredListingEditorFormDialog = 1;
	const ListingEditorDialog = requireListingEditorDialog();
	const ListingEditorForm = requireListingEditorForm();
	const { ref, computed } = require$$2$1;
	const validateEmail = requireEmail();
	const validateWikipedia = requireWikipedia();
	const validateImage = requireImage();
	const validateCoords = requireCoords();

	ListingEditorFormDialog = {
	    name: 'ListingEditorFormDialog',
	    template: `<ListingEditorDialog
        :disabledMessage="disabledMessage ? $translate( disabledMessage ) : undefined">
    <ListingEditorForm
        @updated:listing="onListingUpdate"
        :lat="lat"
        :long="long"
        :url="url"
        :content="content"
        :lastedit="lastedit"
        :listing-name="listingName"
        :listing-type="listingType"
        :national-currencies="nationalCurrencies"
        :listing-types="listingTypes"
        :wikidata="wikidata"
        :wikipedia="wikipedia"
        :image="image"
        :mode="mode"
        :aka="aka"
        :address="address"
        :email="email"
        :directions="directions"
        :phone="phone"
        :tollfree="tollfree"
        :fax="fax"
        :hours="hours"
        :checkin="checkin"
        :checkout="checkout"
        :price="price"
        :telephoneCodes="telephoneCodes"
        :characters="characters"
        :show-last-edited-field="showLastEditedField" />
</ListingEditorDialog>`,
	    props: {
	        aka: {
	            type: String
	        },
	        address: {
	            type: String
	        },
	        email: {
	            type: String
	        },
	        directions: {
	            type: String
	        },
	        phone: {
	            type: String
	        },
	        tollfree: {
	            type: String
	        },
	        fax: {
	            type: String
	        },
	        hours: {
	            type: String
	        },
	        checkin: {
	            type: String
	        },
	        checkout: {
	            type: String
	        },
	        price: {
	            type: String
	        },
	        lat: {
	            type: String
	        },
	        long: {
	            type: String
	        },
	        url: {
	            type: String
	        },
	        content: {
	            type: String
	        },
	        lastedit: {
	            type: String
	        },
	        listingName: {
	            type: String
	        },
	        listingTypes: {
	            type: Array
	        },
	        wikipedia: {
	            type: String
	        },
	        wikidata: {
	            type: String
	        },
	        image: {
	            type: String
	        },
	        mode: {
	            type: String
	        },
	        telephoneCodes: {
	            type: Array
	        },
	        characters: {
	            type: Array
	        },
	        showLastEditedField: {
	            type: Boolean
	        },
	        nationalCurrencies: {
	            type: Array
	        },
	        listingType: {
	            type: String
	        }
	    },
	    components: {
	        ListingEditorDialog,
	        ListingEditorForm
	    },
	    setup( { listingName, address, aka, email, wikipedia, image, lat, long } ) {
	        // All listings must have a name, address or alt name.
	        const hasData = ref( listingName || address || aka );

	        const emailValid = ref( email ? validateEmail( email ) : true );
	        const wikipediaValid = ref( validateWikipedia( wikipedia ) );
	        const imageValid = ref( validateImage( image ) );
	        const coordsValid = ref( validateCoords( lat, long ) );
	        const disabledMessage = computed( () => {
	            if ( !hasData.value ) {
	                return 'validationEmptyListing';
	            } else if ( !coordsValid.value ) {
	                return 'validationCoords';
	            } else if ( !wikipediaValid.value ) {
	                return 'validationWikipedia';
	            } else if ( !imageValid.value ) {
	                return 'validationImage';
	            } else if ( !emailValid.value ) {
	                return 'validationEmail';
	            } else {
	                return '';
	            }
	        } );

	        const onListingUpdate = ( data ) => {
	            hasData.value = data.name || data.address || data.alt;
	            emailValid.value = validateEmail( data.email );
	            wikipediaValid.value = validateWikipedia( data.wikipedia );
	            imageValid.value = validateImage( data.image );
	            coordsValid.value = validateCoords( data.lat, data.long );
	        };
	        return {
	            onListingUpdate,
	            disabledMessage
	        };
	    }
	};
	return ListingEditorFormDialog;
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
	    if ( !listingTypeRegExp ) {
	        throw new Error( 'please define listingTypeRegExp in [[MediaWiki:Gadget-ListingEditor.json]]' );
	    }
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

var savePayload_1;
var hasRequiredSavePayload;

function requireSavePayload () {
	if (hasRequiredSavePayload) return savePayload_1;
	hasRequiredSavePayload = 1;
	const savePayload = ( editPayload ) => {
	    const api = new mw.Api();
	    let abortedByUser = false;
	    const abort = ( rtn ) => {
	        return () => {
	            abortedByUser = true;
	            rtn.reject( 'http', {
	                textStatus: 'Aborted by user'
	            } );
	        };
	    };
	    const delayedReject = ( res, data ) => {
	        const rtn = $.Deferred();
	        setTimeout(() => {
	            if ( !abortedByUser ) {
	                rtn.reject( res, data );
	            }
	        }, window.__save_debug_timeout || 5000 );
	        rtn.abort = abort( rtn );
	        return rtn;
	    };
	    const delayedPromise = ( res ) => {
	        const rtn = $.Deferred();
	        setTimeout(() => {
	            if ( !abortedByUser ) {
	                rtn.resolve( res );
	            }
	            rtn.resolve( res );
	        }, window.__save_debug_timeout || 5000 );
	        rtn.abort = abort( rtn );
	        return rtn;
	    };
	    switch ( window.__save_debug ) {
	        case -1:
	            return delayedPromise( {
	                error: {
	                    code: 3,
	                    info: 'Debug error'
	                }
	            } );
	        case -2:
	            return delayedPromise( {
	                edit: {
	                    captcha: {
	                        id: 1,
	                        url: 'foo.gif'
	                    }
	                }
	            } );
	        case -3:
	            return delayedPromise( {
	                edit: {
	                    spamblacklist: true
	                }
	            } );
	        case -4:
	            return delayedReject(
	                'http',
	                { textStatus: 'http error ' }
	            );
	        case -5:
	            return delayedReject(
	                'ok-but-empty'
	            );
	        case -6:
	            return delayedReject(
	                'unknown'
	            );
	        case -7:
	            return delayedPromise( {
	                edit: {}
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

var saveForm_1;
var hasRequiredSaveForm;

function requireSaveForm () {
	if (hasRequiredSaveForm) return saveForm_1;
	hasRequiredSaveForm = 1;
	const getSectionName = requireGetSectionName();
	const { translate } = translate_1;
	const savePayload = requireSavePayload();
	const { getSectionText } = requireCurrentEdit();
	const { getConfig } = Config;

	/**
	 * If an error occurs while saving the form, remove the "saving" dialog,
	 * restore the original listing editor form (with all user content), and
	 * display an alert with a failure message.
	 */
	const saveFailed = function(msg) {
	    alert(msg);
	};

	const abortableReject = ( data ) => {
	    const reject = Promise.reject( data );
	    reject.abort = () => {};
	    return reject;
	};

	const abortableResolve = ( data ) => {
	    const resolve = Promise.resolve( data );
	    resolve.abort = () => {};
	    return resolve;
	};

	/**
	 * Execute the logic to post listing editor changes to the server so that
	 * they are saved. After saving the page is refreshed to show the updated
	 * article.
	 */
	const saveForm = function(summary, minor, sectionNumber, cid, answer) {
	    const { EDITOR_TAG } = getConfig();
	    var editPayload = {
	        action: "edit",
	        title: mw.config.get( "wgPageName" ),
	        tags: EDITOR_TAG,
	        section: sectionNumber,
	        text: getSectionText(),
	        summary,
	        captchaid: cid,
	        captchaword: answer
	    };
	    if (minor) {
	        $.extend( editPayload, { minor: 'true' } );
	    }
	    const payload = savePayload(editPayload);
	    const newPayload = payload.then(function(data) {
	        if (data && data.edit && data.edit.result == 'Success') {
	            if ( data.edit.nochange !== undefined ) {
	                alert( 'Save skipped as there was no change to the content!' );
	                return abortableResolve();
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
	            return abortableReject( {} );
	        } else if (data && data.edit.spamblacklist) {
	            saveFailed(`${translate( 'submitBlacklistError' )}: ${data.edit.spamblacklist}` );
	            return abortableReject( {} );
	        } else if (data && data.edit.captcha) {
	            return abortableReject( {
	                edit: data.edit,
	                    args: [
	                    summary,
	                    minor,
	                    sectionNumber,
	                    data.edit.captcha.id
	                ]
	            } );
	        } else {
	            saveFailed(translate( 'submitUnknownError' ));
	            return abortableReject( {} );
	        }
	    }, function(code, result) {
	        if (code === "http") {
	            saveFailed(`${translate( 'submitHttpError' )}: ${result.textStatus}` );
	        } else if (code === "ok-but-empty") {
	            saveFailed(translate( 'submitEmptyError' ));
	        } else {
	            saveFailed(`${translate( 'submitUnknownError' )}: ${code}` );
	        }
	        return abortableReject( {} );
	    });
	    newPayload.abort = payload.abort;
	    return newPayload;
	};

	saveForm_1 = saveForm;
	return saveForm_1;
}

var fixupFormValues_1;
var hasRequiredFixupFormValues;

function requireFixupFormValues () {
	if (hasRequiredFixupFormValues) return fixupFormValues_1;
	hasRequiredFixupFormValues = 1;
	const trimDecimal = requireTrimDecimal();
	const { getConfig } = Config;

	/**
	 * Logic invoked on form submit to analyze the values entered into the
	 * editor form and fix correctable issues.
	 */
	const fixupFormValues = function() {
	    const { REPLACE_NEW_LINE_CHARS, APPEND_FULL_STOP_TO_DESCRIPTION } = getConfig();
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
	        fixupLatLon( latInput, longInput );
	    }
	    fixupUrl();
	    return true;
	};

	const fixupLatLon = ( latInput, longInput ) => {
	    const lat = Number( latInput );
	    const long = Number( longInput );
	    const savedLat = trimDecimal( lat, 6 );
	    const savedLong = trimDecimal( long, 6 );
	    $('#input-lat').val( savedLat );
	    $('#input-long').val( savedLong );
	};

	const fixupUrl = () => {
	    var webRegex = new RegExp('^https?://', 'i');
	    var url = $('#input-url').val();
	    if (!webRegex.test(url) && url !== '') {
	        $('#input-url').val(`http://${url}`);
	    }
	};

	fixupFormValues_1 = fixupFormValues;
	return fixupFormValues_1;
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

	updateSectionTextWithAddedListing.test = {
	    updateSectionTextWithAddedListingIt
	};


	updateSectionTextWithAddedListing_1 = updateSectionTextWithAddedListing;
	return updateSectionTextWithAddedListing_1;
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

var formToText_1;
var hasRequiredFormToText;

function requireFormToText () {
	if (hasRequiredFormToText) return formToText_1;
	hasRequiredFormToText = 1;
	const { MODE_ADD } = requireMode();
	const {
	    EDITOR_MINOR_EDIT_SELECTOR,
	    EDITOR_SUMMARY_SELECTOR
	} = requireSelectors();
	const getListingInfo = requireGetListingInfo();
	const listingToStr = requireListingToStr();
	const updateSectionTextWithEditedListing = requireUpdateSectionTextWithEditedListing();
	const updateSectionTextWithAddedListing = requireUpdateSectionTextWithAddedListing();
	const saveForm = requireSaveForm();
	const editSummarySection = requireEditSummarySection();
	const { getConfig } = Config;

	/**
	 * Convert the listing editor form entry fields into wiki text. This
	 * method converts the form entry fields into a listing template string,
	 * replaces the original template string in the section text with the
	 * updated entry, and then submits the section text to be saved on the
	 * server.
	 *
	 * @return {JQuery.Ajax}
	 */
	const formToText = function(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber) {
	    const { LISTING_TYPE_PARAMETER, DEFAULT_LISTING_TEMPLATE } = getConfig();
	    var listing = listingTemplateAsMap;
	    var defaultListingParameters = getListingInfo(DEFAULT_LISTING_TEMPLATE);
	    var listingTypeInput = defaultListingParameters[LISTING_TYPE_PARAMETER].id;
	    var listingType = $(`#${listingTypeInput}`).val();
	    var listingParameters = getListingInfo(listingType);
	    for (var parameter in listingParameters) {
	        listing[parameter] = $(`#${listingParameters[parameter].id}`).val() || '';
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
	    return saveForm(summary, minor, sectionNumber, '', '');
	};

	formToText_1 = formToText;
	return formToText_1;
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

var listingTemplateAsMapToEnglish;
var hasRequiredListingTemplateAsMapToEnglish;

function requireListingTemplateAsMapToEnglish () {
	if (hasRequiredListingTemplateAsMapToEnglish) return listingTemplateAsMapToEnglish;
	hasRequiredListingTemplateAsMapToEnglish = 1;
	const { getConfig } = Config;
	/*
	{
	    "tipo": "see",
	    "nome": "Duomo Normanno",
	    "alt": "",
	    "sito": "http://www.comune.naro.ag.it/libro3.htm",
	    "email": "",
	    "indirizzo": "",
	    "lat": "37.29683",
	    "long": "13.795193",
	    "indicazioni": "",
	    "tel": "",
	    "numero verde": "",
	    "fax": "",
	    "orari": "",
	    "prezzo": "",
	    "wikidata": "Q3716372",
	    "descrizione": "Esso venne edificato nel 1089 ad opera di Ruggero D'Altavilla al di sopra di una preesistente moschea araba poco dopo la conquista normanna di Naro avvenuta nel 1086 e venne dedicato a Maria Santissima Assunta dagli Angeli. Venne elevato a Chiesa Madre, ad opera di Gualtiero Offmill Arcivescovo di Palermo, nel 1174, anno in cui venne abbandonato il rito ortodosso nella Chiesa di San Nicolò di Bari. Il portale d'ingresso è di epoca chiaramontana e presenta un caratteristico arco a sesto acuto poggiato sopra un gruppo di quattordici colonnine, riccamente modulato ed ornato da zig-zag e palmette.\n:Nel 1889 venne destinato a cimitero dei morti di colera e le opere custodite al suo interno furono per la maggior parte portate in altre chiese. Il Duomo, restaurato nei primi anni del secolo XXI è stato fortemente destabilizzato dall'evento franoso che colpì il centro abitato il 4 febbraio 2005 ed è attualmente puntellato e non fruibile al pubblico."
	}
	    */

	listingTemplateAsMapToEnglish = ( map ) => {
	    const { LISTING_TEMPLATE_PARAMETERS } = getConfig();
	    const enMap = {};
	    Object.keys( LISTING_TEMPLATE_PARAMETERS ).forEach( ( key ) => {
	        const { id } = LISTING_TEMPLATE_PARAMETERS[ key ];
	        // strip input to get associated parameter name.
	        enMap[ id.replace( 'input-', '' ).replace( '-value', '' ) ] = map[ key ];
	    } );
	    return enMap;
	};
	return listingTemplateAsMapToEnglish;
}

var openListingEditorDialog_1;
var hasRequiredOpenListingEditorDialog;

function requireOpenListingEditorDialog () {
	if (hasRequiredOpenListingEditorDialog) return openListingEditorDialog_1;
	hasRequiredOpenListingEditorDialog = 1;
	const dialog = requireDialogs();
	const ListingEditorFormDialog = requireListingEditorFormDialog();
	const getListingWikitextBraces = requireGetListingWikitextBraces();
	const saveForm = requireSaveForm();
	const { EDITOR_CLOSED_SELECTOR } = requireSelectors();
	const { MODE_ADD, MODE_EDIT } = requireMode();
	const fixupFormValues = requireFixupFormValues();
	const stripComments = requireStripComments();
	const isCustomListingType = requireIsCustomListingType();
	const formToText = requireFormToText();
	const wikiTextToListing = requireWikiTextToListing();
	const { translate } = translate_1;
	const { getSectionText, setSectionText } = requireCurrentEdit();
	const { getConfig } = Config;
	const listingTemplateAsMapToEnglish = requireListingTemplateAsMapToEnglish();

	/**
	 * This method is called asynchronously after the initListingEditorDialog()
	 * method has retrieved the existing wiki section content that the
	 * listing is being added to (and that contains the listing wiki syntax
	 * when editing).
	 */
	var openListingEditorDialog = function(mode, sectionNumber, listingIndex, listingType, {
	    telephoneCodes,
	    NATL_CURRENCY
	}) {
	     const {
	        LISTING_TYPE_PARAMETER,
	        SPECIAL_CHARS,
	        LISTING_TEMPLATES_OMIT,
	        SUPPORTED_SECTIONS,
	        SHOW_LAST_EDITED_FIELD
	    } = getConfig();

	    setSectionText(
	        stripComments(
	            getSectionText()
	        )
	    );

	    var listingTemplateAsMap, listingTemplateWikiSyntax;
	    if (mode == MODE_ADD) {
	        listingTemplateAsMap = {};
	        listingTemplateAsMap[LISTING_TYPE_PARAMETER] = listingType;
	    } else {
	        listingTemplateWikiSyntax = getListingWikitextBraces(listingIndex);
	        listingTemplateAsMap = wikiTextToListing(listingTemplateWikiSyntax);
	        listingType = listingTemplateAsMap[LISTING_TYPE_PARAMETER];
	    }
	    // modal form - must submit or cancel
	    const dialogTitleSuffix = window.__USE_LISTING_EDITOR_BETA__ ? 'Beta' : '';

	    let captchaSaveArgs;

	    const handleCaptchaError = ( setCaptcha, reset ) => {
	        return ( { edit, args } ) => {
	            if ( edit && edit.captcha ) {
	                captchaSaveArgs = args;
	                setCaptcha( edit.captcha.url );
	            } else {
	                reset();
	            }
	        }
	    };

	    const onCaptchaSubmit = ( setCaptcha, closeAction ) => {
	        if ( captchaSaveArgs ) {
	            captchaSaveArgs.push( $('#input-captcha').val() );
	            setCaptcha( '' );
	            saveForm.apply( null, captchaSaveArgs ).then( () => {
	                captchaSaveArgs = null;
	                closeAction();
	            }, handleCaptchaError( setCaptcha, closeAction ) );
	        }
	    };
	    /**
	     * @param {Function} closeDialog
	     * @param {Function} reset
	     * @param {Function} setCaptcha
	     * @return {JQuery.Ajax}
	     */
	    const onSubmit = ( closeDialog, reset, setCaptcha ) => {
	        const teardown = handleCaptchaError( setCaptcha, reset );
	        let rtn;
	        if ($(EDITOR_CLOSED_SELECTOR).is(':checked')) {
	            // no need to validate the form upon deletion request
	            rtn = formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber);
	        } else {
	            fixupFormValues();
	            rtn = formToText(mode, listingTemplateWikiSyntax, listingTemplateAsMap, sectionNumber);
	        }
	        const newRtn = rtn.then( closeDialog, teardown );
	        newRtn.abort = rtn.abort;
	        return newRtn;
	    };

	    const customListingType = isCustomListingType(listingType) ? listingType : undefined;
	    const listingTemplateAsMapEn = listingTemplateAsMapToEnglish( listingTemplateAsMap );
	    const { wikipedia, wikidata, image, lat, long,
	        alt, address, email, directions, phone, tollfree, fax,
	        hours, checkin, checkout, price,
	        name, content, lastedit, url } = listingTemplateAsMapEn;

	    const app = dialog.render( ListingEditorFormDialog, {
	        wikipedia, wikidata, image,
	        lat, url, long, content,
	        lastedit,
	        address,
	        email,
	        directions,
	        phone,
	        tollfree,
	        fax,
	        hours,
	        checkin, checkout,
	        price,
	        aka: alt,
	        listingName: name,
	        listingType,
	        nationalCurrencies: NATL_CURRENCY,
	        listingTypes: (
	                customListingType ? SUPPORTED_SECTIONS.concat( listingType ) : SUPPORTED_SECTIONS
	            ).filter( ( a ) => !LISTING_TEMPLATES_OMIT.includes( a ) ),
	        mode,
	        onCaptchaSubmit,
	        onSubmit,
	        telephoneCodes,
	        characters: SPECIAL_CHARS,
	        showLastEditedField: mode === MODE_EDIT && SHOW_LAST_EDITED_FIELD,
	        onHelp: () => {
	            window.open( translate( 'helpPage' ) );
	        },
	        title: (mode == MODE_ADD) ?
	            translate( `addTitle${dialogTitleSuffix}` ) : translate( `editTitle${dialogTitleSuffix}` ),
	        dialogClass: 'listing-editor-dialog'
	    } );
	    app.test = {
	        handleCaptchaError,
	        onCaptchaSubmit,
	        onSubmit
	    };
	    return app;
	};

	openListingEditorDialog_1 = openListingEditorDialog;
	return openListingEditorDialog_1;
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

var localData;
var hasRequiredLocalData;

function requireLocalData () {
	if (hasRequiredLocalData) return localData;
	hasRequiredLocalData = 1;
	let CC = '';
	let LC = '';

	const loadFromCountryData = ( $el ) => {
	    CC = '';
	    dataSel = $el.attr('data-country-calling-code');
	    if ((dataSel !== undefined) && (dataSel !== '')) CC = dataSel;
	    LC = '';
	    dataSel = $el.attr('data-local-dialing-code');
	    if ((dataSel !== undefined) && (dataSel !== '')) LC = dataSel;

	    let NATL_CURRENCY = [];
	    var dataSel =  $el.attr('data-currency');
	    if ((dataSel !== undefined) && (dataSel !== '')) {
	        NATL_CURRENCY = dataSel.split( ',' ).map( function( item ) {
	            return item.trim();
	        });
	    }
	    const telephoneCodes = [];
	    if ( CC ) {
	        telephoneCodes.push( CC );
	    }
	    if ( LC ) {
	        telephoneCodes.push( LC );
	    }
	    return {
	        telephoneCodes,
	        NATL_CURRENCY
	    };
	};

	localData = {
	    loadFromCountryData
	};
	return localData;
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

var initListingEditorDialog_1;
var hasRequiredInitListingEditorDialog;

function requireInitListingEditorDialog () {
	if (hasRequiredInitListingEditorDialog) return initListingEditorDialog_1;
	hasRequiredInitListingEditorDialog = 1;
	const IS_LOCALHOST = window.location.host.indexOf( 'localhost' ) > -1;
	const { MODE_ADD, MODE_EDIT } = requireMode();
	const isInline = requireIsInline();
	const openListingEditorDialog = requireOpenListingEditorDialog();
	const currentEdit = requireCurrentEdit();
	const api = new mw.Api();
	const { translate } = translate_1;
	const findListingIndex = requireFindListingIndex();
	const findSectionIndex = requireFindSectionIndex();
	const findSectionHeading = requireFindSectionHeading();
	const localData = requireLocalData();
	const { setSectionText } = requireCurrentEdit();
	const { getConfig } = Config;

	/**
	 * Return the listing template type appropriate for the section that
	 * contains the provided DOM element (example: "see" for "See" sections,
	 * etc). If no matching type is found then the default listing template
	 * type is returned.
	 */
	const _findListingTypeForSection = requireFindListingTypeForSection();
	const findListingTypeForSection = function(entry ) {
	    const { SECTION_TO_TEMPLATE_TYPE,
	        DEFAULT_LISTING_TEMPLATE } = getConfig();
	    return _findListingTypeForSection( entry, SECTION_TO_TEMPLATE_TYPE, DEFAULT_LISTING_TEMPLATE );
	};

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
	    var listingIndex = mode === MODE_ADD ? -1 : findListingIndex(sectionHeading, clicked);
	    currentEdit.setInlineListing( mode === MODE_EDIT && isInline(clicked) );

	    const {
	        telephoneCodes,
	        NATL_CURRENCY
	    } = localData.loadFromCountryData( $( '.countryData' ) );

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
	        openListingEditorDialog(
	            mode, sectionIndex, listingIndex, listingType,
	            {
	                telephoneCodes,
	                NATL_CURRENCY
	            }
	        );
	    }, function( _jqXHR, textStatus, errorThrown ) {
	        alert( `${translate( 'ajaxInitFailure' )}: ${textStatus} ${errorThrown}`);
	    });
	};

	initListingEditorDialog_1 = initListingEditorDialog;
	return initListingEditorDialog_1;
}

const TRANSLATIONS_ALL = translations;
const { LANG } = globalConfig;
const translateModule = translate_1;
const { loadConfig } = Config;

var src = ( function ( ALLOWED_NAMESPACE, SECTION_TO_TEMPLATE_TYPE, PROJECT_CONFIG ) {

	var PROJECT_CONFIG_KEYS = [
		'SHOW_LAST_EDITED_FIELD', 'SUPPORTED_SECTIONS',
		'listingTypeRegExp', 'REPLACE_NEW_LINE_CHARS', 'LISTING_TEMPLATES_OMIT',
		'VALIDATE_CALLBACKS_EMAIL',
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
			EDITOR_CLOSED_SELECTOR,
			EDITOR_SUMMARY_SELECTOR,
			EDITOR_MINOR_EDIT_SELECTOR
		} = requireSelectors();

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
			EDITOR_CLOSED_SELECTOR,
			EDITOR_SUMMARY_SELECTOR,
			EDITOR_MINOR_EDIT_SELECTOR
		};
	}();
	loadConfig( Config, PROJECT_CONFIG );

	return {
		initListingEditorDialog: requireInitListingEditorDialog()
	}
} );

//</nowiki>

var index = /*@__PURE__*/getDefaultExportFromCjs(src);

module.exports = index;
