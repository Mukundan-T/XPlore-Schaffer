/**
 * This module draws the zones on the map background, sets a background shade, and
 * makes them interactive.
 */

import React from "react";

interface ObjectsProps {
  handleObjectClick: (e: React.MouseEvent<SVGPathElement>) => void;
  className?: string;
  currentFloor: string;
}

/**
 * This variable zoneData is a list of zones to draw on each floor. Each zone has
 * four properties:
 * 
 * - ID: This is the name of the zone as it should appear on the website.
 *     ***** This ID MUST match the corresponding "name" in db.json and 
 *     "objectName" in graphData.ts under vertices that are entered for that
 *     particular area *****
 * - d: This is the SVG path determined by the XML coordinates of the particular
 * zone (usually in the XML editor in an image editor such as Inkscape).
 * - Floor: This specifies which floor the area is on. 
 *     ***** MUST be one of the following: floor3, floor2, floor1, floor0 *****
 * - Type: Specifies whether the zone should be a regular shade ("allowed") or
 * red stripes ("restricted")
 */
const zoneData = [
  /*** FLOOR 3 ***/
  {
    id: "Offices",
    d: `m 810.64328,877.4948 
        c 0,70.51461 0,70.51461 0,70.51461 
        h 162.09203 
        v -71.24723 
        z`,
    floor: "floor3",
    type: "restricted"
  },
  {
    id: "Library Administration",
    d: `m 700.01777,1075.1189 
        v 131.1388 
        h 184.25376 
        v -68.4999 
        h 95.24051 
        V 950.57357 
        H 825.66198 
        v 124.54533 
        z`,
    floor: "floor3",
    type: "allowed"
  },
  {
    id: "Special Collections",
    d: `m 333.7081,282.79106 
        c -0.36631,217.22163 -0.36631,217.22163 -0.36631,217.22163 
        L 542.1383,500.379 
        v -54.21383 
        h 520.1597 
        v 54.94645 
        h 189.0158 
        l 0.3663,-218.68687 
        z`,
    floor: "floor3",
    type: "allowed"
  },
  {
    id: "Processing and Digitization",
    d: `m 811.0096,790.12995 -0.18316,87.54801 160.80995,-0.18316 0.36631,-56.778
        H 833.7208
        l -0.18316,-30.58685
        z`,
    floor: "floor3",
    type: "restricted"
  },
  {
    id: "Quiet Study Floor 3",
    d: `m 541.61092,446.03252 -0.25902,53.61715 438.89276,0.91248 -0.0458,122.73664
              -163.83244,-0.0966 0.0462,44.07661 284.87588,-0.10795 0.136,-43.52869 
              -88.0409,0.11045 0.1037,-123.46523 48.971,-0.0229 0.042,-53.84348
        z`,
    floor: "floor3",
    type: "allowed"
  },
  {
    id: "Restrooms Floor 3",
    d: `m 834.82162,709.97395 0.021,37.43513 25.62198,-0.007 
          -0.25902,34.19065 -25.84374,0.24919 0.0712,38.86283 
          137.0216,-0.25902
        V 709.97395
        Z`,
    floor: "floor3",
    type: "allowed"
  },

  /*** FLOOR 2 ***/
  {
    id: "Office 202",
    d: `m 1289.6138,993.89441
        h 68.1018
        v 55.13629
        h -68.1018
        z`,
    floor: "floor2",
    type: "allowed"
  },
  {
    id: "Writing Center",
    d: `m 740.73882,865.67956 0.26193,191.99494
        H 862.01254
        V 948.1876
        h -52.64799
        l 0.52386,-82.76997
        z`,
    floor: "floor2",
    type: "allowed"
  },
  {
    id: "Phi Beta Kappa (PBK) Room",
    d: `m 1266.1709,773.2182
        h 92.7233
        v 176.00172
        h -92.7233
        z`,
    floor: "floor2",
    type: "allowed"
  },
  {
    id: "Accommodative Services",
    d: `m 840.53425,775.11717 -0.13174,151.40923 164.88589,-0.34095 
          -0.2619,-58.41045 114.7254,-0.26193
        v -88.2705
        l -133.32248,0.26193
        v -67.31608
        l -13.09652,1.83351 -11.78686,2.22641 -9.69142,2.48834 -11.263,4.05991 
          -9.56046,4.45282 -10.73914,5.50054 -7.98887,5.6315 -8.77467,7.46501 
          -10.73914,10.73914 -6.67922,8.51273 -6.0244,9.42949
        z`,
    floor: "floor2",
    type: "allowed"
  },
  {
    id: "Open Collaborative Study Floor 2",
    d: `m 574.93695,506.57315 -0.52386,107.91528 117.86863,0.26193
        v 15.97774
        l 211.63966,-0.52386
        V 520.19353
        l 217.14022,-0.26193 77.6348,0.14559 -0.3654,116.28241 161.13,
          -0.33928 0.023,-7.52426 47.0208,-0.16206 0.1853,-16.57654 
          117.61,-0.55564 -0.7408,-101.86697 -14.1863,-0.10965 0.1101,
          -33.78427 -919.90506,0.0463 -0.0387,30.56205
        z`,
    floor: "floor2",
    type: "allowed"
  },
  {
    id: "Permanent Collection",
    d: `m 1148.689,773.63334
        v -53.34125
        l 15.5579,0.18521
        v -83.71613
        l 193.362,-0.74085 -0.1852,137.42781
        z`,
    floor: "floor2",
    type: "allowed"
  },
  {
    id: "Learning Lab",
    d: `m 1007.5569,870.12914 0.1544,185.49896 10.6736,4.3382 
          12.6054,3.8308 16.1087,3.2741 16.2996,1.4207 16.1135,
          -1.0187 16.2987,-2.9634 16.3913,-5.3711 6.5751,-3.5191 
          -0.204,-186.40398
        z`,
    floor: "floor2",
    type: "allowed"
  },
  {
    id: "Engaging Tech Lab",
    d: `m 1148.5643,773.84027 0.033,265.92473 7.0067,-0.1965 
          8.2508,-1.3423 8.8401,-2.4884 7.596,-3.2414 
          7.6942,-4.0599 11.3285,-7.2358 13.2275,-10.8046 
          10.0188,-10.2153 6.0899,-7.20311 4.3873,-5.30408 
          2.5538,-2.61931 30.8937,-0.27849 0.047,-211.44303
        z`,
    floor: "floor2",
    type: "allowed"
  },
  {
    id: "Restrooms Floor 2",
    d: `m 1119.0971,710.09298 -56.9698,-0.26193
        v 23.04986
        h -20.1687
        l -0.1309,-22.13311 -55.00539,-0.26193 
          0.3929,69.01863 130.83419,-0.91676
        z`,
    floor: "floor2",
    type: "allowed"
  },
  {
    id: "Quiet Study Floor 2",
    d: `m 863.58412,1080.4624
        c 0,62.0775 0,62.0775 0,62.0775
        l 92.46138,0.2619 -0.52386,70.1973 191.47106,
          -0.7858
        v -132.0128
        z`,
    floor: "floor2",
    type: "allowed"
  },
  {
    id: "Group Study Area",
    d: `m 1196.7594,1078.3669
        h 40.0753
        v 64.6968
        h -40.0753
        z`,
    floor: "floor2",
    type: "allowed"
  },
  {
    id: "Offices",
    d: `m 741.59155,817.89917
        h 68.52869
        v 47.41444
        h -68.52869
        z`,
    floor: "floor2",
    type: "restricted"
  },
  {
    id: "Offices",
    d: `m 739.73944,682.69391
        h 69.82518
        v 47.78487
        h -69.82518
        z`,
    floor: "floor2",
    type: "restricted"
  },
  {
    id: "Offices",
    d: `m 740.10986,732.14569
        h 69.45475
        v 85.56825
        h -69.45475
        z`,
    floor: "floor2",
    type: "restricted"
  },
  {
    id: "Offices",
    d: `m 1289.6138,949.62823
        h 66.9232
        v 43.34947
        h -66.9232
        z`,
    floor: "floor2",
    type: "restricted"
  }, 
  {
    id: "Stacks (A-D)",
    d: `m 590.08759,287.8205 453.96651,0.30281 0.3602,188.61412 -42.4137,-0.18521
        v -12.22404
        l -96.90052,-0.31869
        v 12.04879
        l -97.66541,-0.24691 -0.0926,-12.22404 -104.6486,0.0293 0.096,11.82434
        H 589.25413
        l 0.27782,-99.27399 -14.90962,-0.18521 0.0926,-42.13589 15.37265,0.0926
        z`,
    floor: "floor2",
    type: "allowed"
  },
  {
    id: "Stacks (Oversized)",
    d: `m 1044.0541,288.12331 0.2676,187.96588 56.1194,-0.18522 -0.093,-12.40924 
          99.7178,0.0236 0.019,12.75603
        h 98.3943
        l 0.046,-13.38162 101.9133,-0.23151 0.046,12.96489 109.9237,-0.18522 
          -0.1852,-104.27473 12.9649,-0.18522 0.1852,-41.67285
        h -13.891
        v -41.85806
        z`,
    floor: "floor2",
    type: "allowed"
  }, 
  {
    id: "Additional Quiet Study Floor 2",
    d: `m 895.08126,287.20656 0.0655,-23.44277 2.39012,-5.99165 4.1254,-4.87845 
          9.23304,-5.36957 7.1376,-3.33961 93.87658,-43.04354 16.2987,-4.63032 
          18.336,-2.12994
        h 18.2435
        l 16.6691,2.22255 15.4653,4.3525 13.3353,5.74159 92.699,43.15455 5.3935,5.72657
        4.7147,8.05436 0.6548,9.49497
        v 14.73358
        z`,
    floor: "floor2",
    type: "allowed"
  }, 
  
  /*** FLOOR 1 ***/
  {
    id: "Office 105",
    d: `m 1289.7065,661.39257 0.1798,72.08981 9.8876,0.89887 
          7.2759,2.34379 11.5997,4.86235 5.7087,3.40059 
          6.4269,2.5618 5.1686,0.98876 4.5842,0.26966 
          -0.4369,-87.78323
        z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Office 122",
    d: `m 848.35864,1056.8978
        h 103.91001
        v 54.6517
        H 848.35864
        Z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Entrance",
    d: `m 998.9104,1058.4027
        h 64.5771
        v 53.6447
        h -64.5771
        z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Learning Commons (Open Collaborative Study)",
    d: `m 1012.0661,811.58636
        h 327.7806
        v 210.96844
        h -327.7806
        z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Newspapers",
    d: `m 953.27429,1057.64
        h 45.38191
        v 54.0261
        h -45.38191
        z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Library Service Desk",
    d: `M 969.41855,840.26444
        H 861.62063
        v 96.3571
        h 33.30549
        v 42.96662
        h 74.49243
        z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Information Technology Services (ITS)",
    d: `m 861.87488,754.83966
        h 107.54368
        v 83.64508
        H 861.87488
        Z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Restrooms Floor 1",
    d: `m 883.9541,608.5387
        h 38.2921
        v 93.48304
        h -38.2921
        z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Access Services",
    d: `M 723.56812,700.17798
        H 849.16286
        V 984.4187
        H 723.56812
        Z`,
    floor: "floor1",
    type: "restricted"
  },
  {
    id: "Content & Digital Library Systems (CDLS)",
    d: `M 573.56628,365.59766
        H 881.70563
        V 601.02425
        H 573.56628
        Z`,
    floor: "floor1",
    type: "restricted"
  },
  {
    id: "Printers/Copiers",
    d: `m 1086.3691,770.09412
        h 154.9595
        v 28.72916
        h -154.9595
        z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Bloomberg",
    d: `m 1232.4302,661.66057 -4.9577,44.87343 7.6908,4.00429 9.4646,4.38231 
          8.5393,3.82022 13.573,6.29213 11.5057,4.94381 11.3707,3.14607 
          -0.2365,-71.46226
        z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Current Reading Area",
    d: `m 1045.4364,607.63452
        h 166.2732
        v 76.7806
        h -166.2732
        z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Quiet Study Floor 1",
    d: `m 1187.811,360.51285
        h 302.5461
        V 600.00728
        H 1187.811
        Z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Reference JX-Z",
    d: `m 1195.9226,262.63031
        h 292.1462
        v 23.13587
        h -292.1462
        z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "CDs",
    d: `m 1196.017,326.69888
        h 292.0519
        v 34.53786
        H 1196.017
        Z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Lally Reading Room (Quiet Study)",
    d: `m 883.77435,478.20175 -0.17977,-112.6291
        h -5.57303
        l 0.0899,-129.61784 2.24719,-5.97752 3.5955,
          -4.49438 4.1075,-2.89546 102.71311,-48.43279 
          20.63995,-5.61551 18.8764,-2.1573 16.8988,0.26966 
          21.2135,3.50562 16.8988,5.7528 20.3146,9.43819 
          35.4157,16.6292
        h -11.5955
        l -2.9887,0.26966 -1.8637,0.25548 -1.581,0.30985 
          -1.454,0.35753 -1.2394,0.34958 -1.0408,0.34164 
          -1.0328,0.35752 -1.0567,0.42109 -0.8184,0.34958 
          -1.2394,0.57204 -1.0646,0.54026 -1.0805,0.59587 
          -1.0964,0.65944 -2.0503,1.38449 -1.7191,1.33708 
          -1.1798,1.03371 -1.1573,1.07865 -0.8876,0.91011 
          -0.9438,1.05618 -0.8315,0.98876 -0.809,1.01124 
          -0.5955,0.83146 -0.7528,1.13483 -0.6966,1.07865 
          -0.5731,1 -0.4831,0.92134 -0.618,1.25843 -0.4382,
          0.96629 -0.4269,1.04494 -0.4944,1.2809 -0.3933,1.16854 
          -0.2809,0.95505 -0.3708,1.38203 -0.2921,1.46067 -0.2584,
          1.44943 -0.1798,1.26967 -0.1348,1.42696 -0.045,1.1573 
          -0.045,0.92135 0.011,1.14607 0.056,1.30337 0.079,1.24719 
          0.1686,1.50561 0.1573,1.14607 0.2696,1.37078 1.241,4.60334 
          1.0805,2.57418 1.4619,2.95555 1.6526,2.73308 3.2415,4.16319 
          3.0192,2.79664 3.2733,2.47884 3.8454,2.25639 3.3369,1.46188 
          2.7966,0.92162 2.7649,0.69916 4.0996,0.54026 2.9556,0.12712 
          2.9555,-0.12712 3.4005,-0.44492 3.5276,-0.7945 3.0826,-1.1123 
          3.3369,-1.589 4.2586,-2.57419 3.1462,-2.47884 2.9237,-2.98733 
          2.5424,-3.30512 2.2564,-3.75005 1.303,-2.95554 1.1123,-3.01911 
          .9534,-3.59114 0.4132,-3.55937 0.1271,-2.19282 -0.1271,-3.9725 
          -0.3496,-3.01911 -0.3814,-1.87502 -0.3813,-1.589 -0.2702,-1.01697 
          -0.2939,-0.87395 -0.1351,-0.40519
        v -1.08847
        h 3.321
        l -0.048,-10.31262 14.9367,7.37297 6.6738,4.95768 3.178,3.87717 
          2.6695,5.46617 1.017,7.81789 0.1605,117.59498 -7.2809,-0.17978 
          -0.3162,117.5029
        z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Periodicals (Current)",
    d: `M 607.63452,331.52945
        H 878.035
        v 32.03429
        H 607.63452
        Z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Reference A-JX",
    d: `m 607.59077,262.63031
        h 270.67884
        v 26.69524
        H 607.59077
        Z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Atlases",
    d: `m 575.09174,262.63031
        h 32.54277
        v 100.93343
        h -32.54277
        z`,
    floor: "floor1",
    type: "allowed"
  },
  {
    id: "Offices",
    d: `m 723.31384,985.18146
        h 60.76345
        v 43.22084
        h -60.76345
        z`,
    floor: "floor1",
    type: "restricted"
  },
  {
    id: "Offices",
    d: `m 786.36548,985.43567
        h 56.94984
        v 41.44123
        h -56.94984
        z`,
    floor: "floor1",
    type: "restricted"
  },
  {
    id: "Offices",
    d: `m 723.547,655.13446
        h 114.19774
        v 45.43161
        H 723.547
        Z`,
    floor: "floor1",
    type: "restricted"
  },

  /*** BASEMENT ***/
  {
    id: "Study Rooms",
    d: `m 930.15625,1127.9688 0.0937,72.7812 209.60615,-0.3478
          -0.1325,-70.3572 -181.03615,-0.014 -0.29264,-46.5669
          -58.38051,0.1767
        v 44.3268
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Film Editing Room",
    d: `m 842.42934,1071.09 -0.17677,57.0989 
          57.09887,-0.1768 0.26516,-61.5183
        h -33.76434
        l 0.007,4.3968
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Stacks (K)",
    d: `m 735.50715,957.89465
        h 91.57131
        v 68.61175
        h -91.57131
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Stacks (J)",
    d: `m 735.37367,803.86938
        h 91.52718
        v 154.02527
        h -91.52718
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Stacks (H)",
    d: `m 826.90234,803.86719 -0.004,133.8125 169.87109,-0.008 
          -0.004,85.43751 134.42847,-0.4562 0.6067,-204.84849 
          92.0742,0.008
        v -66.8125
        l -93.2113,-0.0526 0.01,-62.86928 -104.8809,0.33452 
          0.1325,115.12583
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Stacks (G)",
    d: `m 1131.8008,817.80469 -0.3828,129.12109 
          92.4623,0.0228 -0.01,-129.13997
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Stacks (E)",
    d: `m 1130.6641,750.94141 93.2052,0.0557 0.01,129.18257 
          98.7656,0.52343 -0.5498,-192.46725 -191.416,-0.15468
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Stacks (F)",
    d: `m 1131.1914,1022.6523 191.2461,-1.0273 
          0.2057,-140.92351 -98.7682,-0.5179
        v 66.75782
        l -92.4561,-0.0149
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Group Study Rooms",
    d: `M 851.625,700
        H 962.75
        v 70.75
        H 851.625
        Z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Restrooms Basement",
    d: `m 847.46747,614.47577
        h 88.91868
        v 53.38656
        h -88.91868
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Microfilm & Microfilm Reader",
    d: `m 873.98398,276.82764
        v -23.40657
        l 1.81197,-6.87228 3.80069,-4.37739 5.08233,-4.4908
          10.87177,-4.80832 92.27744,-43.95536 8.85932,-3.10144
          11.5,-2.72642 14.6425,-2.06505 16.9705,-0.18145 
          14.1422,1.27013 15.2028,3.81037 12.5511,4.7176
          57.4524,28.30562 0.01,-4.19872 25.3125,0.032
          0.031,15.68491 15.7496,7.35215 5.3033,4.35471
          3.7123,5.35267 2.8284,6.89495 0.2652,5.0805
        v 17.50956
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Stacks (L-P)",
    d: `m 678.46893,531.74432
        h 286.02469
        v 63.63961
        H 678.46893
        Z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Stacks (P-Q)",
    d: `m 678.11542,435.22421
        h 286.37823
        v 63.63961
        H 678.11542
        Z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Stacks (Q-T)",
    d: `m 677.40826,338.35059
        h 286.02469
        v 63.28605
        H 677.40826
        Z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Stacks (T-Z)",
    d: `m 1200.137,332.34018
        h 115.0816
        v 62.9325
        H 1200.137
        Z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Periodicals (A-I)",
    d: `m 1110.1576,430.62802
        h 255.2655
        v 63.28606
        h -255.2655
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Periodicals (J-Z)",
    d: `m 1110.5112,528.91589
        h 261.9831
        v 62.57895
        h -261.9831
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Periodicals (Classified)",
    d: `m 1372.5,528.75
        h 82.5
        v 63.125
        h -82.5
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Periodicals (Oversized)",
    d: `m 1407.125,431.125
        h 47.75
        v 62.5
        h -47.75
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Government Documents",
    d: `m 1315.5721,332.34018
        h 139.4769
        v 63.28606
        h -139.4769
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Map Collection",
    d: `m 1082.0502,335.16861
        h 105.7124
        v 59.57375
        h -105.7124
        z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "DVD Collection",
    d: `m 1365.5,431
        h 41.625
        v 63.125
        H 1365.5
        Z`,
    floor: "floor0",
    type: "allowed"
  },
  {
    id: "Quiet Study Basement",
    d: `m 963.43299,337.90865 1.03576,258.02885 
          146.04245,0.15352 -0.3536,-201.87899 
          -28.0633,0.17678 -0.088,-57.40823
        z`,
    floor: "floor0",
    type: "allowed"
  }
];

/**
 * Get the right background shade depending on the zone's type (either restricted or
 * allowed).
 * 
 * @param type the zone's access type ("restricted" or "allowed")
 * @returns the appropriate background shade
 */
function getZoneStyle(type: string) {
  switch (type) {
    case "restricted":
      return {
        fill: "url(#diagonalStripes)",
        stroke: "darkred",
        strokeWidth: 2
      };
    default:
      return {
        fill: "rgba(129, 129, 129, 0.557)",
        stroke: "black",
        strokeWidth: 1
      };
  }
}

function Objects({ handleObjectClick, className, currentFloor }: ObjectsProps) {
  return (
    <g id="Objects">

      {/* Define the red diagonal stripes pattern */}
      <defs>
        <pattern id="diagonalStripes" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
          <line x1="0" y="0" x2="0" y2="6" stroke="red" strokeWidth="9" />
        </pattern>
      </defs>

      {/* Render the backgrounds on the appropriate maps */}
      {zoneData
        .filter((zone) => zone.floor === currentFloor)
        .map((zone, index) => (
          <path
            key={`${zone.id}-${zone.floor}-${index}`}
            id={zone.id}
            className={`${className} object`}
            d={zone.d}
            style={getZoneStyle(zone.type)}
            onClick={handleObjectClick}
          />
        ))}
    </g>
  );
}

export default Objects;