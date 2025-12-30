export interface MapDefinition {
  id: string;
  name: string;
  image: string;
  size: { width: number; height: number };
  markers: Record<string, MapMarker[]>;
}

export interface MapMarker {
  x: number;
  y: number;
  name: string;
  id: string;
}

export const MAPS: Record<string, MapDefinition> = {
  'the-hub': {
    id: 'the-hub',
    name: 'Valley IV - The Hub',
    image: '/images/maps/map_the_hub.png',
    size: { width: 4800, height: 4200 },
    markers: {
      "AIC": [
        { "x": 1825, "y": 1405, "name": "Core AIC Area", "id": "Core_AIC_Area" }
      ],
      "TP_Point": [
        { "x": 3039, "y": 2396, "name": "TP Point Hub Base (outside)", "id": "TP_Point_Hub_Base_(outside)" },
        { "x": 3594, "y": 2419, "name": "TP Point Hub Base (inside)", "id": "TP_Point_Hub_Base_(inside)" },
        { "x": 2886, "y": 2853, "name": "TP Point Construction Site", "id": "TP_Point_Construction_Site" },
        { "x": 2743, "y": 803, "name": "TP Point Logistics Platform", "id": "TP_Point_Logistics_Platform" },
        { "x": 1280, "y": 2932, "name": "TP Point Hub West", "id": "TP_Point_Hub_West" },
        { "x": 1817, "y": 2468, "name": "TP Point Hub Base Power Plant", "id": "TP_Point_Hub_Base_Power_Plant" },
        { "x": 2322, "y": 1033, "name": "TP Point Rockhill Passage", "id": "TP_Point_Rockhill_Passage" }
      ],
      "Mission_LOC": [
        { "x": 3544, "y": 2437, "name": "Algorithmic Memories", "id": "Algorithmic_Memories" }
      ],
      "Energy_Alluvium": [
        { "x": 1887, "y": 2661, "name": "[[Energy Alluvium]]", "id": "Energy_Alluvium" }
      ],
      "Rift": [
        { "x": 1362, "y": 1092, "name": "[[Rift: Skill Up]]", "id": "Rift:_Skill_Up" },
        { "x": 2181, "y": 2536, "name": "[[Crane Support]]", "id": "Crane_Support" },
        { "x": 883, "y": 2098, "name": "[[Pressure Sensitive]]", "id": "Pressure_Sensitive" },
        { "x": 562, "y": 2491, "name": "[[Rift: Weapon Up]]", "id": "Rift:_Weapon_Up" },
        { "x": 1417, "y": 2643, "name": "[[Rift: Weapon Tune]]", "id": "Rift:_Weapon_Tune" },
        { "x": 2147, "y": 1859, "name": "[[Rift: Promotions]]", "id": "Rift:_Promotions" }
      ],
      "Mineral_Bed": [
        { "x": 1890, "y": 1627, "name": "Orignium Ore", "id": "Orignium_Ore_01" },
        { "x": 1365, "y": 1258, "name": "Amethyst Ore", "id": "Amethyst_Ore_01" },
        { "x": 1004, "y": 1735, "name": "Amethyst Ore", "id": "Amethyst_Ore_02" },
        { "x": 2608, "y": 1909, "name": "Orignium Ore", "id": "Orignium_Ore_02" },
        { "x": 2721, "y": 3200, "name": "Amethyst Ore", "id": "Amethyst_Ore_03" },
        { "x": 2888, "y": 3300, "name": "Orignium Ore", "id": "Orignium_Ore_03" },
        { "x": 2195, "y": 1164, "name": "Ferrium Ore", "id": "Ferrium_Ore_01" }
      ],
      "Recycling_Station": [
        { "x": 3539, "y": 2842, "name": "Recycling Station Worker Dorms", "id": "Recycling_Station_Worker_Dorms" },
        { "x": 1532, "y": 3155, "name": "Recycling Station Originium Byproduct Processing Center", "id": "Recycling_Station_Originium_Byproduct_Processing_Center" },
        { "x": 1847, "y": 2344, "name": "Recycling Station Hub Base Power Plant", "id": "Recycling_Station_Hub_Base_Power_Plant" }
      ],
      "Rares": [
        { "x": 1284, "y": 1705, "name": "Kalkodendra Gathering Site", "id": "Kalkodendra_Gathering_Site_01" },
        { "x": 2035, "y": 2715, "name": "Pink Bolete Gathering Site", "id": "Pink_Bolete_Gathering_Site_01" },
        { "x": 2834, "y": 3041, "name": "Kalkodendra Gathering Site", "id": "Kalkodendra_Gathering_Site_02" },
        { "x": 1471, "y": 2645, "name": "Pink Bolete Gathering Site", "id": "Pink_Bolete_Gathering_Site_02" },
        { "x": 2624, "y": 1260, "name": "Chrysodendra Gathering Site", "id": "Chrysodendra_Gathering_Site_01" },
        { "x": 2662, "y": 944, "name": "Chrysodendra Gathering Site", "id": "Chrysodendra_Gathering_Site_02" }
      ],
      "Rare_Mineral": [
        { "x": 2020, "y": 3193, "name": "Kalkonyx Mining Site", "id": "Kalkonyx_Mining_Site_01" },
        { "x": 1029, "y": 3126, "name": "Kalkonyx Mining Site", "id": "Kalkonyx_Mining_Site_02" },
        { "x": 2332, "y": 1472, "name": "Auronyx Mining Site", "id": "Auronyx_Mining_Site_01" }
      ]
    }
  }
};
