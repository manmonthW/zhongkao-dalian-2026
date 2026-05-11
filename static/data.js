// ============================================================
// 2026大连中考模拟系统 - 数据层
// ============================================================

// ===== 2025年9中录取数据（已有，增强） =====
const SCHOOL_DATA = {
  "大连市第二十四中学":   { short:"24中", tier:1, tongzhao:777,   zhibiao_min:775,  zhibiao_max:776.5, zhibiao_num:6, tongtiao:776 },
  "大连育明高级中学":     { short:"育明", tier:1, tongzhao:772,   zhibiao_min:771.5,zhibiao_max:773.5, zhibiao_num:7, tongtiao:772 },
  "大连市第八中学":       { short:"8中",  tier:1, tongzhao:767.5, zhibiao_min:767,  zhibiao_max:774.5, zhibiao_num:7, tongtiao:767.5 },
  "大连二十四中金普校区": { short:"24金", tier:2, tongzhao:767.5, zhibiao_min:764.5,zhibiao_max:764.5, zhibiao_num:1, tongtiao:766 },
  "大连理工大学附属高中": { short:"辽附", tier:2, tongzhao:766,   zhibiao_min:766,  zhibiao_max:771,   zhibiao_num:6, tongtiao:766 },
  "大连市第一中学":       { short:"1中",  tier:2, tongzhao:763.5, zhibiao_min:765.5,zhibiao_max:768,   zhibiao_num:4, tongtiao:764 },
  "大连市第二十三中学":   { short:"23中", tier:3, tongzhao:759,   zhibiao_min:760,  zhibiao_max:763,   zhibiao_num:7, tongtiao:760 },
  "大连市第十二中学":     { short:"12中", tier:3, tongzhao:758,   zhibiao_min:757.5,zhibiao_max:766.5, zhibiao_num:6, tongtiao:758 },
  "大连理工附属高中工附": { short:"理工附",tier:3, tongzhao:756,   zhibiao_min:753,  zhibiao_max:757,   zhibiao_num:4, tongtiao:755 },
  "大连市第二十高级中学": { short:"20高", tier:3, tongzhao:751,   zhibiao_min:749,  zhibiao_max:761,   zhibiao_num:7, tongtiao:751 },
  "大连市第三十六中学":   { short:"36中", tier:4, tongzhao:754,   zhibiao_min:756,  zhibiao_max:762.5, zhibiao_num:4, tongtiao:755 },
  "大连旅顺中学":         { short:"旅顺", tier:4, tongzhao:747.75,zhibiao_min:721.5,zhibiao_max:null,  zhibiao_num:1, tongtiao:740 },
  "大连市第十三中学":     { short:"13中", tier:4, tongzhao:746.5, zhibiao_min:745.5,zhibiao_max:753,   zhibiao_num:5, tongtiao:746 },
  "大连市第三中学":       { short:"3中",  tier:4, tongzhao:746,   zhibiao_min:735,  zhibiao_max:751,   zhibiao_num:6, tongtiao:742 },
  "大连市第四十八中学":   { short:"48中", tier:4, tongzhao:743,   zhibiao_min:735,  zhibiao_max:748,   zhibiao_num:5, tongtiao:740 },
  "大连市第十一中学":     { short:"11中", tier:5, tongzhao:741.5, zhibiao_min:728,  zhibiao_max:748,   zhibiao_num:7, tongtiao:738 },
  "大连市第二中学":       { short:"2中",  tier:5, tongzhao:737.5, zhibiao_min:727,  zhibiao_max:748.5, zhibiao_num:5, tongtiao:734 },
  "大连市第十六中学":     { short:"16中", tier:5, tongzhao:734.5, zhibiao_min:726.5,zhibiao_max:738.5, zhibiao_num:4, tongtiao:732 },
  "大连红旗高级中学":     { short:"红旗", tier:5, tongzhao:732,   zhibiao_min:718.5,zhibiao_max:733.5, zhibiao_num:5, tongtiao:728 }
};

// ===== 历年统招分数线（2021-2025，来自图4）=====
const HISTORY_SCORES = {
  "24中": { 2021: 208, 2022: 667.5, 2023: 666.0, 2024: 777.0, 2025: 777.0 },
  "育明": { 2021: 561, 2022: 660.0, 2023: 660.0, 2024: 773.0, 2025: 772.0 },
  "8中":  { 2021:1181, 2022: 654.5, 2023: 654.5, 2024: 769.5, 2025: 767.5 },
  "24金": { 2021: null,2022: null,  2023: null,  2024: 769.2, 2025: 767.5 },
  "辽附": { 2021:1709, 2022: 643.0, 2023: 647.0, 2024: 767.0, 2025: 766.0 },
  "1中":  { 2021:2495, 2022: 643.0, 2023: 642.0, 2024: 765.0, 2025: 763.5 },
  "23中": { 2021:1817, 2022: 640.0, 2023: 642.0, 2024: 762.0, 2025: 759.0 },
  "12中": { 2021:2495, 2022: 643.0, 2023: 642.0, 2024: 759.5, 2025: 758.0 },
  "理工附":{ 2021:3918,2022: 632.0, 2023: 630.0, 2024: 755.5, 2025: 756.0 },
  "20高": { 2021:4156, 2022: 632.0, 2023: 629.5, 2024: 754.0, 2025: 751.0 },
  "36中": { 2021:4156, 2022: 632.0, 2023: 629.5, 2024: 754.0, 2025: 754.0 },
  "13中": { 2021:4324, 2022: 619.5, 2023: 615.0, 2024: 747.5, 2025: 746.5 },
  "3中":  { 2021:5324, 2022: 619.5, 2023: 615.0, 2024: 746.6, 2025: 746.0 },
  "48中": { 2021:6092, 2022: 619.5, 2023: 614.0, 2024: 743.5, 2025: 743.0 },
  "11中": { 2021:7867, 2022: 617.5, 2023: 615.0, 2024: 742.5, 2025: 741.5 },
  "2中":  { 2021:6533, 2022: 611.0, 2023: 609.5, 2024: 737.0, 2025: 737.5 },
  "16中": { 2021:6533, 2022: 606.0, 2023: 611.0, 2024: 737.0, 2025: 734.5 },
  "红旗": { 2021:5670, 2022: 601.5, 2023: 605.0, 2024: 735.0, 2025: 732.0 }
};
// 注：2021年分数体系不同（可能为排名或不同总分），2022-2023为满分700+体系，2024-2025为790体系

// ===== 2026年招生计划（图2）=====
const ENROLLMENT_2026 = {
  "24中": { total:516, tongzhao:134, tz_change:-10, zhibiao:382 },
  "育明": { total:555, tongzhao:144, tz_change:-11, zhibiao:411 },
  "8中":  { total:506, tongzhao:132, tz_change:-10, zhibiao:374 },
  "24金": { total:460, tongzhao:120, tz_change:-3,  zhibiao:111 },
  "辽附": { total:460, tongzhao:120, tz_change:-9,  zhibiao:340 },
  "1中":  { total:368, tongzhao:96,  tz_change:-7,  zhibiao:272 },
  "23中": { total:534, tongzhao:139, tz_change:-11, zhibiao:395 },
  "12中": { total:462, tongzhao:120, tz_change:-9,  zhibiao:342 },
  "理工附":{ total:291, tongzhao:76, tz_change:-5,  zhibiao:215 },
  "20高": { total:466, tongzhao:121, tz_change:-9,  zhibiao:345 },
  "36中": { total:327, tongzhao:85,  tz_change:-7,  zhibiao:242 },
  "旅顺": { total:345, tongzhao:0,   tz_change:0,   zhibiao:33 },
  "13中": { total:323, tongzhao:84,  tz_change:-6,  zhibiao:239 },
  "3中":  { total:460, tongzhao:120, tz_change:-9,  zhibiao:340 },
  "48中": { total:372, tongzhao:97,  tz_change:-7,  zhibiao:275 },
  "11中": { total:477, tongzhao:124, tz_change:-10, zhibiao:353 },
  "2中":  { total:462, tongzhao:120, tz_change:-9,  zhibiao:342 },
  "16中": { total:345, tongzhao:90,  tz_change:-7,  zhibiao:255 },
  "红旗": { total:380, tongzhao:99,  tz_change:-7,  zhibiao:281 }
};

// ===== 2025年9中指标分配名额（图3）=====
const ZHIBIAO_ALLOC_9ZHONG = {
  "24中": 6, "育明": 7, "8中": 7, "24金": 1, "辽附": 6,
  "1中": 4, "23中": 7, "12中": 6, "理工附": 4, "20高": 7,
  "36中": 4, "旅顺": 1, "13中": 5, "3中": 6, "48中": 5,
  "11中": 7, "2中": 5, "16中": 4, "红旗": 5
};

// ===== 2025年9中指标填报分析（图4下半部分）=====
const ZHIBIAO_FILING_2025 = {
  "24中": { quota:6,  filA:49, filB:0,  filAB:49, filA_pct:816.7 },
  "育明": { quota:7,  filA:13, filB:18, filAB:31, filA_pct:257.1 },
  "8中":  { quota:7,  filA:20, filB:82, filAB:102,filA_pct:214.3 },
  "24金": { quota:1,  filA:3,  filB:6,  filAB:9,  filA_pct:600.0 },
  "辽附": { quota:6,  filA:3,  filB:5,  filAB:8,  filA_pct:100.0 },
  "1中":  { quota:4,  filA:4,  filB:14, filAB:18, filA_pct:100.0 },
  "23中": { quota:7,  filA:0,  filB:14, filAB:14, filA_pct:0 },
  "12中": { quota:6,  filA:0,  filB:42, filAB:42, filA_pct:0 },
  "理工附":{ quota:4,  filA:0,  filB:16, filAB:16, filA_pct:0 },
  "20高": { quota:7,  filA:5,  filB:15, filAB:20, filA_pct:157.1 },
  "36中": { quota:4,  filA:3,  filB:26, filAB:29, filA_pct:105.0 },
  "13中": { quota:5,  filA:0,  filB:17, filAB:17, filA_pct:0 },
  "3中":  { quota:6,  filA:0,  filB:4,  filAB:4,  filA_pct:0 },
  "48中": { quota:5,  filA:0,  filB:12, filAB:12, filA_pct:0 },
  "11中": { quota:7,  filA:0,  filB:0,  filAB:0,  filA_pct:0 },
  "2中":  { quota:5,  filA:7,  filB:45, filAB:52, filA_pct:0 },
  "16中": { quota:4,  filA:0,  filB:6,  filAB:6,  filA_pct:0 },
  "红旗": { quota:5,  filA:0,  filB:8,  filAB:8,  filA_pct:0 }
};

// ===== 2024-2025年9中指标使用对比（图1）=====
const ZHIBIAO_COMPARE = {
  "24中": { tz2025:777.0, zb2025:775.0, diff2025: 2.0,  tz2024:777.0, zb2024:774.0, diff2024: 3.0  },
  "育明": { tz2025:772.0, zb2025:771.5, diff2025: 0.5,  tz2024:773.0, zb2024:769.5, diff2024: 3.5  },
  "8中":  { tz2025:767.5, zb2025:767.0, diff2025: 0.75, tz2024:769.5, zb2024:767.0, diff2024: 2.5  },
  "24金": { tz2025:767.5, zb2025:764.5, diff2025: 3.0,  tz2024:769.2, zb2024:760.5, diff2024: 8.7  },
  "辽附": { tz2025:766.0, zb2025:766.0, diff2025: 0.0,  tz2024:767.0, zb2024:766.25,diff2024: 0.75 },
  "1中":  { tz2025:763.5, zb2025:765.5, diff2025:-2.0,  tz2024:765.0, zb2024:762.5, diff2024: 2.5  },
  "23中": { tz2025:759.0, zb2025:760.0, diff2025:-1.0,  tz2024:762.0, zb2024:757.0, diff2024: 5.0  },
  "12中": { tz2025:758.0, zb2025:757.5, diff2025: 0.5,  tz2024:759.5, zb2024:761.8, diff2024:-2.3  },
  "理工附":{ tz2025:756.0, zb2025:753.0, diff2025: 3.0,  tz2024:755.5, zb2024:751.5, diff2024: 4.0  },
  "20高": { tz2025:751.0, zb2025:749.0, diff2025: 2.0,  tz2024:754.0, zb2024:748.4, diff2024: 5.6  },
  "36中": { tz2025:754.0, zb2025:756.0, diff2025:-2.0,  tz2024:754.0, zb2024:753.0, diff2024: 1.0  },
  "旅顺": { tz2025:747.75,zb2025:721.5, diff2025:26.25, tz2024:752.0, zb2024:null,  diff2024: null },
  "13中": { tz2025:746.5, zb2025:745.5, diff2025: 1.0,  tz2024:747.5, zb2024:742.5, diff2024: 5.0  },
  "3中":  { tz2025:746.0, zb2025:735.0, diff2025:11.0,  tz2024:746.6, zb2024:739.0, diff2024: 7.6  },
  "48中": { tz2025:743.0, zb2025:735.0, diff2025: 8.0,  tz2024:743.5, zb2024:736.5, diff2024: 7.0  },
  "11中": { tz2025:741.5, zb2025:728.0, diff2025:13.5,  tz2024:742.5, zb2024:736.0, diff2024: 6.5  },
  "2中":  { tz2025:737.5, zb2025:727.0, diff2025:10.5,  tz2024:737.0, zb2024:null,  diff2024: null },
  "16中": { tz2025:734.5, zb2025:726.5, diff2025: 8.0,  tz2024:737.0, zb2024:731.5, diff2024: 5.5  },
  "红旗": { tz2025:732.0, zb2025:718.5, diff2025:13.5,  tz2024:735.0, zb2024:729.0, diff2024: 6.0  }
};

// ===== 2026年一分一段表（模考600分制，+190=中考790总分）=====
const YIFENYIDUAN = [
  {score:580, rank:81},   {score:579, rank:118},  {score:578, rank:155},
  {score:577, rank:192},  {score:576, rank:229},  {score:575, rank:266},
  {score:574, rank:330},  {score:573, rank:395},  {score:572, rank:459},
  {score:571, rank:524},  {score:570, rank:588},  {score:569, rank:687},
  {score:568, rank:786},  {score:567, rank:885},  {score:566, rank:984},
  {score:565, rank:1083}, {score:564, rank:1223}, {score:563, rank:1363},
  {score:562, rank:1503}, {score:561, rank:1643}, {score:560, rank:1783},
  {score:559, rank:1937}, {score:558, rank:2091}, {score:557, rank:2246},
  {score:556, rank:2400}, {score:555, rank:2554}, {score:554, rank:2727},
  {score:553, rank:2900}, {score:552, rank:3072}, {score:551, rank:3245},
  {score:550, rank:3418}, {score:549, rank:3595}, {score:548, rank:3773},
  {score:547, rank:3950}, {score:546, rank:4128}, {score:545, rank:4305},
  {score:544, rank:4487}, {score:543, rank:4669}, {score:542, rank:4850},
  {score:541, rank:5032}, {score:540, rank:5214}, {score:539, rank:5391},
  {score:538, rank:5568}, {score:537, rank:5744}, {score:536, rank:5921},
  {score:535, rank:6098}, {score:534, rank:6266}, {score:533, rank:6433},
  {score:532, rank:6601}, {score:531, rank:6768}, {score:530, rank:6936},
  {score:529, rank:7104}, {score:528, rank:7272}, {score:527, rank:7439},
  {score:526, rank:7607}, {score:525, rank:7775}, {score:524, rank:7933},
  {score:523, rank:8090}, {score:522, rank:8248}, {score:521, rank:8405},
  {score:520, rank:8563}, {score:519, rank:8714}, {score:518, rank:8865},
  {score:517, rank:9016}, {score:516, rank:9167}, {score:515, rank:9318},
  {score:514, rank:9468}, {score:513, rank:9618}, {score:512, rank:9769},
  {score:511, rank:9919}, {score:510, rank:10069},{score:509, rank:10200},
  {score:508, rank:10330},{score:507, rank:10461},{score:506, rank:10591},
  {score:505, rank:10722},{score:504, rank:10841},{score:503, rank:10961},
  {score:502, rank:11080},{score:501, rank:11200},{score:500, rank:11319},
  {score:499, rank:11424},{score:498, rank:11530},{score:497, rank:11635},
  {score:496, rank:11741},{score:495, rank:11848},{score:494, rank:11946},
  {score:493, rank:12044},{score:492, rank:12148},{score:491, rank:12249},
  {score:490, rank:12350},{score:489, rank:12450},{score:488, rank:12549},
  {score:487, rank:12649},{score:486, rank:12748},{score:485, rank:12848},
  {score:484, rank:12946},{score:483, rank:13044},{score:482, rank:13141},
  {score:481, rank:13239},{score:480, rank:13337},{score:479, rank:13425},
  {score:478, rank:13513},{score:477, rank:13600},{score:476, rank:13688},
  {score:475, rank:13776},{score:474, rank:13857},{score:473, rank:13939},
  {score:472, rank:14020},{score:471, rank:14102},{score:470, rank:14183},
  {score:469, rank:14255},{score:468, rank:14328},{score:467, rank:14400},
  {score:466, rank:14473},{score:465, rank:14545},{score:464, rank:14611},
  {score:463, rank:14676},{score:462, rank:14742},{score:461, rank:14807},
  {score:460, rank:14873},{score:459, rank:14937},{score:458, rank:15000},
  {score:457, rank:15064},{score:456, rank:15127},{score:455, rank:15191},
  {score:454, rank:15256},{score:453, rank:15321},{score:452, rank:15387},
  {score:451, rank:15452},{score:450, rank:15517},{score:449, rank:15573},
  {score:448, rank:15628},{score:447, rank:15684},{score:446, rank:15739},
  {score:445, rank:15795},{score:444, rank:15852},{score:443, rank:15910},
  {score:442, rank:15967},{score:441, rank:16025},{score:440, rank:16082},
  {score:439, rank:16134},{score:438, rank:16187},{score:437, rank:16239},
  {score:436, rank:16292},{score:435, rank:16344},{score:434, rank:16390},
  {score:433, rank:16436},{score:432, rank:16481},{score:431, rank:16527},
  {score:430, rank:16573},{score:429, rank:16628},{score:428, rank:16684},
  {score:427, rank:16739},{score:426, rank:16795},{score:425, rank:16850},
  {score:424, rank:16903},{score:423, rank:16956},{score:422, rank:17008},
  {score:421, rank:17061},{score:420, rank:17114},{score:419, rank:17162},
  {score:418, rank:17211},{score:417, rank:17259},{score:416, rank:17308},
  {score:415, rank:17356},{score:414, rank:17408},{score:413, rank:17460},
  {score:412, rank:17511},{score:411, rank:17563},{score:410, rank:17615},
  {score:409, rank:17656},{score:408, rank:17697},{score:407, rank:17737},
  {score:406, rank:17778},{score:405, rank:17819},{score:404, rank:17853},
  {score:403, rank:17888},{score:402, rank:17922},{score:401, rank:17957},
  {score:400, rank:17991},{score:399, rank:18029},{score:398, rank:18067},
  {score:397, rank:18105},{score:396, rank:18143},{score:395, rank:18181},
  {score:394, rank:18218},{score:393, rank:18256},{score:392, rank:18293},
  {score:391, rank:18331},{score:390, rank:18368},{score:389, rank:18401},
  {score:388, rank:18435},{score:387, rank:18468},{score:386, rank:18502},
  {score:385, rank:18535},{score:384, rank:18568},{score:383, rank:18602},
  {score:382, rank:18635},{score:381, rank:18669},{score:380, rank:18702},
  {score:379, rank:18738},{score:378, rank:18773},{score:377, rank:18809},
  {score:376, rank:18844},{score:375, rank:18880},{score:374, rank:18914},
  {score:373, rank:18949},{score:372, rank:18983},{score:371, rank:19018},
  {score:370, rank:19052},{score:369, rank:19081},{score:368, rank:19109},
  {score:367, rank:19138},{score:366, rank:19166},{score:365, rank:19195},
  {score:364, rank:19225},{score:363, rank:19256},{score:362, rank:19286},
  {score:361, rank:19317},{score:360, rank:19347},{score:359, rank:19374},
  {score:358, rank:19402},{score:357, rank:19429},{score:356, rank:19457},
  {score:355, rank:19484},{score:354, rank:19513},{score:353, rank:19542},
  {score:352, rank:19570},{score:351, rank:19599},{score:350, rank:19628},
  {score:349, rank:19657},{score:348, rank:19685},{score:347, rank:19714},
  {score:346, rank:19742},{score:345, rank:19771},{score:344, rank:19798},
  {score:343, rank:19824},{score:342, rank:19851},{score:341, rank:19877},
  {score:340, rank:19904},{score:339, rank:19927},{score:338, rank:19950},
  {score:337, rank:19972},{score:336, rank:19995},{score:335, rank:20018},
  {score:334, rank:20041},{score:333, rank:20063},{score:332, rank:20086},
  {score:331, rank:20108},{score:330, rank:20131},{score:329, rank:20155},
  {score:328, rank:20179},{score:327, rank:20203},{score:326, rank:20227},
  {score:325, rank:20251},{score:324, rank:20274},{score:323, rank:20298},
  {score:322, rank:20321},{score:321, rank:20345},{score:320, rank:20368},
  {score:319, rank:20394},{score:318, rank:20420},{score:317, rank:20445},
  {score:316, rank:20471},{score:315, rank:20497},{score:314, rank:20520},
  {score:313, rank:20544},{score:312, rank:20567},{score:311, rank:20591},
  {score:310, rank:20614},{score:309, rank:20635},{score:308, rank:20657},
  {score:307, rank:20678},{score:306, rank:20700},{score:305, rank:20721},
  {score:304, rank:20740},{score:303, rank:20758},{score:302, rank:20777},
  {score:301, rank:20795},{score:300, rank:20814}
];

// ===== 一般普通高中（模拟数据）=====
const GENERAL_SCHOOLS = {
  "大连市第四中学（公办）":   { score: 720 },
  "大连信息高中（公办）":     { score: 710 },
  "大连经贸高中（公办）":     { score: 700 },
  "大连综合中专（公办）":     { score: 690 },
  "大连博雅高中（民办）":     { score: 680 },
  "大连嘉汇高中（民办）":     { score: 715 },
  "大连汇文高中（民办）":     { score: 695 },
  "大连华南高中（民办）":     { score: 685 }
};

// ===== 工具函数 =====

/** 模考分(600) → 中考预估分(790) */
function mokaToZhongkao(mokaScore) {
  return mokaScore + 190;
}

/** 中考分(790) → 模考分(600) */
function zhongkaoToMoka(zkScore) {
  return zkScore - 190;
}

/** 根据模考分查位次（插值） */
function getRankByMokaScore(mokaScore) {
  if (mokaScore >= 580) return YIFENYIDUAN[0].rank;
  if (mokaScore <= 300) return YIFENYIDUAN[YIFENYIDUAN.length - 1].rank;
  for (let i = 0; i < YIFENYIDUAN.length - 1; i++) {
    if (mokaScore <= YIFENYIDUAN[i].score && mokaScore >= YIFENYIDUAN[i + 1].score) {
      if (mokaScore === YIFENYIDUAN[i].score) return YIFENYIDUAN[i].rank;
      if (mokaScore === YIFENYIDUAN[i + 1].score) return YIFENYIDUAN[i + 1].rank;
      // 线性插值
      const ratio = (YIFENYIDUAN[i].score - mokaScore) / (YIFENYIDUAN[i].score - YIFENYIDUAN[i + 1].score);
      return Math.round(YIFENYIDUAN[i].rank + ratio * (YIFENYIDUAN[i + 1].rank - YIFENYIDUAN[i].rank));
    }
  }
  return null;
}

/** 根据中考总分查位次 */
function getRankByZkScore(zkScore) {
  return getRankByMokaScore(zhongkaoToMoka(zkScore));
}

/** 指标竞争热度等级 */
function getHeatLevel(filAB, quota) {
  const ratio = filAB / quota;
  if (ratio >= 5) return { level: 'extreme', label: '极度竞争', color: 'heat-red' };
  if (ratio >= 2) return { level: 'high', label: '竞争激烈', color: 'heat-orange' };
  if (ratio >= 1) return { level: 'medium', label: '中度竞争', color: 'heat-orange' };
  return { level: 'low', label: '竞争宽松', color: 'heat-green' };
}

/** 指标到校性价比评级 */
function getZhibiaoValue(schoolShort) {
  const cmp = ZHIBIAO_COMPARE[schoolShort];
  const fil = ZHIBIAO_FILING_2025[schoolShort];
  if (!cmp || !fil) return { rating: '—', desc: '数据不足' };
  const diff = cmp.diff2025;
  const heat = fil.filAB / fil.quota;
  if (diff < 0) return { rating: '⚠️ 不推荐', desc: `指标分高于统招线${Math.abs(diff).toFixed(1)}分，不如统招` };
  if (diff >= 0 && diff <= 3 && heat > 3) return { rating: '⚠️ 慎选', desc: `降分仅${diff.toFixed(1)}分但竞争${heat.toFixed(1)}倍` };
  if (diff > 5 && heat < 2) return { rating: '⭐ 推荐', desc: `降分${diff.toFixed(1)}分且竞争温和` };
  if (diff > 3) return { rating: '👍 可选', desc: `降分${diff.toFixed(1)}分，竞争${heat.toFixed(1)}倍` };
  return { rating: '➖ 一般', desc: `降分${diff.toFixed(1)}分` };
}
