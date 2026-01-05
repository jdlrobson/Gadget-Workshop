const SEE_TEST = `{{see
| name=Test | alt= | url= | email=
| address= | lat= | long= | directions=
| phone= | tollfree=
| hours= | price=
| lastedit=2021-06-24
| content=this is a test
}}`;

const NOTTINGHAM = `===Historic sites out of town===
* {{see
| name=Newstead Abbey | alt= | url=http://www.newsteadabbey.org.uk | email=
| address= | lat=53.078333 | long=-1.1925 | directions=
| phone= | tollfree= | fax=
| hours= | price=
| image=Newstead Abbey 02.jpg
| wikidata=Q1819331| wikipedia=Newstead Abbey
| content=The beautiful home of local poet Lord Byron is 12 miles (19 km) north of the city. It is well worth a visit, and the website supplies extensive information on how to travel to the site. Lord Byron was buried in '''Hucknall Church''', and his tomb can be seen inside the church at the end of Hucknall's high street, a few minutes walk from the Hucknall tram stop.
}}
* {{see
| name=Great Central Railway - Nottingham | alt= | url=http://www.gcrn.co.uk | email=info@gcrn.co.uk
| address=Mere Way, Ruddington, NG11 6JS | lat=52.8845928 | long=-1.1463983 | directions={{mi|6}} south of Nottingham
| phone=+44 115 940-5705 | tollfree= | fax=
| hours=Sa Su 10AM-5PM | price=
| content=Offers journeys on historic steam and diesel locomotives, has a collection of historic buses on display along with 3 model railway exhibits.
}}
* ${SEE_TEST}
* {{see
| name=Framework Knitters' Museum | alt= | url=https://www.frameworkknittersmuseum.org.uk/ | email=
| address=Chapel St, Ruddington NG11 6HE | lat=52.891 | long=-1.152 | directions=
| phone=+44 115 984-6914 | tollfree= | fax= | hours= | price=£9
| lastedit=2025-07-17 
| content=This technology is early 19th century, transitional between cottage industry and the great Victorian mill halls. 
}}`;


module.exports = {
    NOTTINGHAM,
    SEE_TEST
};
