export type SignShape =
  | "stop" | "yield" | "prohib" | "limit" | "command" | "no-entry"
  | "warning" | "warning-temp" | "info-blue" | "guide-green" | "rect-white";

export interface SignSpec {
  id: string;
  name: string;
  category: "regulatory" | "warning" | "guidance" | "information" | "temporary";
  shape: SignShape;
  glyph?: string;
  desc: string;
}

export const SIGN_CATEGORIES = [
  { id: "regulatory", name: "Regulatory signs", blurb: "Orders you must obey: stop, yield, limits, prohibitions and commands." },
  { id: "warning", name: "Warning signs", blurb: "Red-bordered triangles that warn you what the road does ahead." },
  { id: "guidance", name: "Guidance signs", blurb: "Green and blue signs that show routes, directions and exits." },
  { id: "information", name: "Information signs", blurb: "Services and facilities: fuel, food, hospitals, rest stops." },
  { id: "temporary", name: "Temporary signs", blurb: "Yellow roadworks signs — obey them like permanent signs." },
] as const;

export const SIGNS: SignSpec[] = [
  // Regulatory — control
  { id: "stop", name: "Stop", category: "regulatory", shape: "stop", desc: "Stop completely behind the stop line. Go only when it is safe." },
  { id: "yield", name: "Yield", category: "regulatory", shape: "yield", desc: "Give way to traffic and pedestrians in or near the junction. Stop if needed." },
  { id: "no-entry", name: "No entry", category: "regulatory", shape: "no-entry", glyph: "no-entry-bar", desc: "You may not enter this road from this side." },
  { id: "one-way", name: "One-way road", category: "regulatory", shape: "rect-white", glyph: "one-way", desc: "All traffic on this road moves in the direction of the arrow." },
  // Regulatory — limits
  { id: "speed-60", name: "Speed limit 60", category: "regulatory", shape: "limit", glyph: "speed-60", desc: "You may not drive faster than 60 km/h from this sign." },
  { id: "speed-100", name: "Speed limit 100", category: "regulatory", shape: "limit", glyph: "speed-100", desc: "You may not drive faster than 100 km/h from this sign." },
  { id: "speed-120", name: "Speed limit 120", category: "regulatory", shape: "limit", glyph: "speed-120", desc: "You may not drive faster than 120 km/h from this sign." },
  { id: "min-speed-40", name: "Minimum speed 40", category: "regulatory", shape: "command", glyph: "min-40", desc: "You may not drive slower than 40 km/h in this lane or road." },
  { id: "height-limit", name: "Height limit", category: "regulatory", shape: "limit", glyph: "height-4m", desc: "Vehicles higher than the shown height may not proceed." },
  { id: "weight-limit", name: "Weight limit 10 t", category: "regulatory", shape: "limit", glyph: "weight-10t", desc: "Vehicles heavier than the shown weight (GVM) may not proceed." },
  // Regulatory — prohibitions
  { id: "no-stopping", name: "No stopping", category: "regulatory", shape: "prohib", glyph: "stop-s", desc: "You may not stop your vehicle here, even briefly." },
  { id: "no-parking", name: "No parking", category: "regulatory", shape: "prohib", glyph: "parking-p", desc: "You may not park here. A short stop to drop a passenger may still be allowed." },
  { id: "no-overtaking", name: "No overtaking", category: "regulatory", shape: "prohib", glyph: "car", desc: "Overtaking other vehicles is prohibited on this section." },
  { id: "no-cars", name: "Motor cars prohibited", category: "regulatory", shape: "prohib", glyph: "car", desc: "Motor cars may not go past this sign." },
  { id: "no-trucks", name: "Goods vehicles prohibited", category: "regulatory", shape: "prohib", glyph: "truck", desc: "Goods vehicles may not go past this sign." },
  { id: "no-cyclists", name: "Cyclists prohibited", category: "regulatory", shape: "prohib", glyph: "bicycle", desc: "Pedal cycles may not go past this sign." },
  { id: "no-pedestrians", name: "Pedestrians prohibited", category: "regulatory", shape: "prohib", glyph: "person", desc: "Pedestrians may not go past this sign — common on freeways." },
  { id: "no-u-turn", name: "No U-turn", category: "regulatory", shape: "prohib", glyph: "u-turn", desc: "You may not make a U-turn at this point." },
  { id: "no-left-turn", name: "No left turn", category: "regulatory", shape: "prohib", glyph: "arrow-turn-left", desc: "Turning left is prohibited at this junction." },
  // Regulatory — commands
  { id: "proceed-straight", name: "Proceed straight only", category: "regulatory", shape: "command", glyph: "arrow-up", desc: "You must continue straight ahead." },
  { id: "turn-left", name: "Turn left", category: "regulatory", shape: "command", glyph: "arrow-left", desc: "You must turn in the direction of the arrow." },
  { id: "turn-right", name: "Turn right", category: "regulatory", shape: "command", glyph: "arrow-right", desc: "You must turn in the direction of the arrow." },
  { id: "keep-left", name: "Keep left", category: "regulatory", shape: "command", glyph: "keep-left", desc: "Pass this sign or island on its left side." },
  { id: "roundabout", name: "Mini-circle / roundabout", category: "regulatory", shape: "command", glyph: "roundabout", desc: "Move around the circle. Yield to traffic already in the circle, from your right." },
  { id: "cycles-only", name: "Cycles only", category: "regulatory", shape: "command", glyph: "bicycle", desc: "This lane or path is reserved for pedal cycles." },
  { id: "pedestrians-only", name: "Pedestrians only", category: "regulatory", shape: "command", glyph: "person", desc: "This area is reserved for pedestrians." },
  // Warning signs
  { id: "w-general", name: "General warning", category: "warning", shape: "warning", glyph: "exclaim", desc: "Danger ahead that no other sign describes. Slow down and be alert." },
  { id: "w-crossroad", name: "Crossroad ahead", category: "warning", shape: "warning", glyph: "crossroad", desc: "An intersection is ahead. Check for crossing traffic." },
  { id: "w-t-junction", name: "T-junction ahead", category: "warning", shape: "warning", glyph: "t-junction", desc: "The road you are on ends ahead. Prepare to turn left or right." },
  { id: "w-curve-right", name: "Sharp curve right", category: "warning", shape: "warning", glyph: "curve-right", desc: "Slow down before the curve — not in it." },
  { id: "w-curve-left", name: "Sharp curve left", category: "warning", shape: "warning", glyph: "curve-left", desc: "Slow down before the curve — not in it." },
  { id: "w-hairpin", name: "Hairpin bend", category: "warning", shape: "warning", glyph: "hairpin", desc: "A very sharp bend ahead. Reduce speed strongly." },
  { id: "w-two-way", name: "Two-way traffic ahead", category: "warning", shape: "warning", glyph: "two-way", desc: "The one-way section ends — expect oncoming traffic." },
  { id: "w-narrow", name: "Road narrows", category: "warning", shape: "warning", glyph: "narrow", desc: "Less space ahead. Adjust your position and be ready to give way." },
  { id: "w-traffic-light", name: "Traffic signals ahead", category: "warning", shape: "warning", glyph: "traffic-light", desc: "Signals ahead, possibly hidden. Be ready to stop." },
  { id: "w-ped-crossing", name: "Pedestrian crossing ahead", category: "warning", shape: "warning", glyph: "ped-crossing", desc: "Approach so you can stop for people on the crossing." },
  { id: "w-children", name: "Children ahead", category: "warning", shape: "warning", glyph: "children", desc: "School or play area — children can run into the road. Slow down." },
  { id: "w-animals", name: "Wild or farm animals", category: "warning", shape: "warning", glyph: "animal", desc: "Animals may be on the road, especially at dusk. Slow down." },
  { id: "w-cyclists", name: "Cyclists ahead", category: "warning", shape: "warning", glyph: "bicycle", desc: "Expect cyclists on the roadway. Pass with at least 1 m of space." },
  { id: "w-railway", name: "Railway crossing", category: "warning", shape: "warning", glyph: "railway", desc: "A level crossing ahead. Look and listen — never stop on the tracks." },
  { id: "w-slippery", name: "Slippery road", category: "warning", shape: "warning", glyph: "slippery", desc: "Poor grip ahead, worst when wet. Avoid sudden braking or steering." },
  { id: "w-steep-down", name: "Steep descent", category: "warning", shape: "warning", glyph: "hill", desc: "Use a lower gear so the engine helps you brake." },
  { id: "w-rocks", name: "Falling rocks", category: "warning", shape: "warning", glyph: "rocks", desc: "Watch for rocks on the road. Do not stop in this area." },
  { id: "w-hump", name: "Speed hump", category: "warning", shape: "warning", glyph: "hump", desc: "A raised hump ahead — slow down well before it." },
  { id: "w-gravel", name: "Gravel road / loose stones", category: "warning", shape: "warning", glyph: "gravel", desc: "Loose surface: longer braking distance and flying stones." },
  { id: "w-stop-ahead", name: "Stop sign ahead", category: "warning", shape: "warning", glyph: "stop-go", desc: "A stop is ahead, possibly hidden. Begin slowing down now." },
  // Guidance
  { id: "g-route-n1", name: "National route marker N1", category: "guidance", shape: "guide-green", glyph: "route-n1", desc: "Identifies the national route. Follow markers to stay on the route." },
  { id: "g-direction", name: "Direction sign", category: "guidance", shape: "guide-green", glyph: "arrow-right", desc: "Shows the direction to the destination named on the sign." },
  { id: "g-freeway-dir", name: "Freeway direction sign", category: "guidance", shape: "info-blue", glyph: "arrow-up", desc: "Blue signs guide you along the freeway and to exits." },
  { id: "g-exit-300", name: "Exit countdown 300 m", category: "guidance", shape: "info-blue", glyph: "exit-3", desc: "Three bars = 300 m to the exit. Move into the exit lane in time." },
  { id: "g-dead-end", name: "No through road", category: "guidance", shape: "info-blue", glyph: "dead-end", desc: "The road ahead has no exit." },
  { id: "g-one-way-guide", name: "One-way indication", category: "guidance", shape: "info-blue", glyph: "one-way", desc: "Shows the travel direction of a one-way road." },
  // Information
  { id: "i-info", name: "Information centre", category: "information", shape: "info-blue", glyph: "info-i", desc: "Tourist or traveller information available." },
  { id: "i-hospital", name: "Hospital", category: "information", shape: "info-blue", glyph: "hospital-h", desc: "A hospital is nearby. Expect ambulances; keep noise down." },
  { id: "i-fuel", name: "Filling station", category: "information", shape: "info-blue", glyph: "fuel", desc: "Fuel is available ahead or at the next exit." },
  { id: "i-phone", name: "Emergency telephone", category: "information", shape: "info-blue", glyph: "phone", desc: "An emergency phone point — help if you break down." },
  { id: "i-food", name: "Restaurant / refreshments", category: "information", shape: "info-blue", glyph: "food", desc: "Food and refreshments available ahead." },
  { id: "i-bed", name: "Accommodation", category: "information", shape: "info-blue", glyph: "bed", desc: "Overnight accommodation available ahead." },
  { id: "i-parking", name: "Parking", category: "information", shape: "info-blue", glyph: "parking-p", desc: "A parking place or area is available." },
  // Temporary (roadworks)
  { id: "t-roadworks", name: "Roadworks ahead", category: "temporary", shape: "warning-temp", glyph: "roadworks", desc: "Workers and machines on the road. Slow down and follow instructions." },
  { id: "t-narrow", name: "Road narrows (temporary)", category: "temporary", shape: "warning-temp", glyph: "narrow", desc: "Lanes are reduced at the works. Merge early and calmly." },
  { id: "t-stop-go", name: "Stop/Go control ahead", category: "temporary", shape: "warning-temp", glyph: "stop-go", desc: "A person with a STOP/GO board controls traffic. Obey the board." },
  { id: "t-gravel", name: "Loose stones (temporary)", category: "temporary", shape: "warning-temp", glyph: "gravel", desc: "Fresh gravel: slow down and keep distance from other cars." },
  { id: "t-slippery", name: "Slippery surface (temporary)", category: "temporary", shape: "warning-temp", glyph: "slippery", desc: "New or wet surfacing is slippery — drive gently." },
];

export function signById(id: string): SignSpec | undefined {
  return SIGNS.find((s) => s.id === id);
}
