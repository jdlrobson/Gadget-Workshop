// map section heading ID to the listing template to use for that section
module.exports = function ( DB_NAME = 'enwikivoyage' ) {
    switch ( DB_NAME ) {
        case 'frwikivoyage':
            return {
                Aller: 'Aller',
                Circuler: 'Circuler',
                Voir: 'Voir',
                Faire: 'Faire',
                Acheter: 'Acheter',
                Manger: 'Manger',
                Communiquer: 'Listing',
                'Boire_un_verre_.2F_Sortir': 'Sortir',
                Sortir: 'Sortir',
                Se_loger: 'Se loger',
                'S.C3.A9curit.C3.A9': 'Listing',
                'G.C3.A9rer_le_quotidien': 'Représentation diplomatique',
                Villes: 'Ville',
                Autres_destinations: 'Destination',
                Aux_environs: 'Destination'
            };
        case 'itwikivoyage':
            return {
                'Cosa_vedere': 'see',
                'Cosa_fare': 'do',
                'Acquisti': 'buy',
                'Dove_mangiare': 'eat',
                'Come_divertirsi': 'drink',
                'Dove_alloggiare': 'sleep',
                'Eventi_e_feste': 'listing',
                'Come arrivare': 'listing',
                'Come spostarsi': 'listing'
            };
        case 'viwikivoyage':
            return {
                'Xem': 'tham_quan',
                'Tham_quan': 'tham_quan',
                'Làm': 'hoạt_động',
                'Hoạt_động': 'hoạt_động',
                'Việc_có_thể_làm': 'hoạt_động',
                'Mua': 'mua_sắm',
                'Mua_sắm': 'mua_sắm',
                'Ăn': 'ẩm_thực',
                'Ẩm_thực': 'ẩm_thực',
                'Uống': 'đồ_uống',
                'Đồ_uống': 'đồ_uống',
                'Ngủ': 'nghỉ_ngơi',
                'Chỗ_nghỉ': 'nghỉ_ngơi',
                'Nghỉ_ngơi': 'nghỉ_ngơi',
                'Kết_nối': 'địa_điểm',
                'Khu_vực_chờ': 'tham_quan',
                'Tham_quan_và_hoạt_động': 'tham_quan',
                'Ăn_uống': 'ẩm_thực',
                'Đến': 'đi_lại',
                'Đi_lại': 'đi_lại',
                'Đi_dạo': 'đi_lại',
            };
        default:
            return {
                'See': 'see',
                'Do': 'do',
                'Buy': 'buy',
                'Eat': 'eat',
                'Drink': 'drink',
                'Sleep': 'sleep',
                'Connect': 'listing',
                'Wait': 'see',
                'See_and_do': 'see',
                'Eat_and_drink': 'eat',
                'Get_in': 'go',
                'Get_around': 'go',
                'Anreise': 'station', // go
                'Mobilität': 'public transport', // go
                'Sehenswürdigkeiten': 'monument', // see
                'Aktivitäten': 'sports', // do
                'Einkaufen': 'shop', // buy
                'Küche': 'restaurant', // eat
                'Nachtleben': 'bar', // drink
                // dummy line (es) // drink and night life
                'Unterkunft': 'hotel', // sleep
                'Lernen': 'education', // education
                'Arbeiten': 'administration', // work
                'Sicherheit': 'administration', // security
                'Gesundheit': 'health', // health
                'Praktische_Hinweise': 'office' // practicalities
            };
    }
};
