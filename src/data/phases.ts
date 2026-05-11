// ============================================================
// ARISE: The System — All 10 Training Phases
// ============================================================

export interface Exercise {
  name: string;
  sets: string;
  reps: string;
  rest: string;
  cue: string;
}

export interface PhaseDay {
  label: string;
  type: 'strength' | 'mobility' | 'cardio' | 'rest' | 'walk';
  exercises: Exercise[];
  cardioNote?: string;
}

export interface PhaseReadiness {
  checks: string[];
}

export interface Phase {
  id: number;
  name: string;
  subtitle: string;
  duration: string;
  durationWeeks: number;
  rank: string;
  description: string;
  schedule: PhaseDay[];
  readiness: PhaseReadiness;
  calorieTarget: string;
  proteinTarget: string;
}

export const PHASES: Phase[] = [
  // ─────────────────────────────────────────────────────────
  // PHASE 0: Emergency Recovery
  // ─────────────────────────────────────────────────────────
  {
    id: 0,
    name: 'Emergency Recovery',
    subtitle: 'Stabilise the System',
    duration: '2 Weeks',
    durationWeeks: 2,
    rank: 'E',
    description: 'Your body is under attack. Gut issues. Allergies. Low immunity. This phase is about fixing your foundation — breathing, sleep, hostel routine, and inflammation control. No heavy exercise yet.',
    calorieTarget: '2,200–2,350 kcal',
    proteinTarget: '80–90 g',
    readiness: {
      checks: [
        'Wake up consistently at 6:30 AM for 7+ days',
        'Complete breathing exercises (Anulom Vilom + Bhramari) daily',
        'Zero cold water for the full 2 weeks',
        'Steam inhalation every evening without skipping',
        'At least 7 hours sleep each night',
        'Gut discomfort is improving',
      ],
    },
    schedule: [
      {
        label: 'Morning Breathing',
        type: 'mobility',
        exercises: [
          { name: 'Warm water (1 glass)', sets: '1', reps: 'On wake-up', rest: '-', cue: 'Carry a flask. Always warm, never cold.' },
          { name: 'Anulom Vilom (Alternate Nostril)', sets: '1', reps: '10 min', rest: '-', cue: 'Inhale left, exhale right. Equal counts. Slow and deep.' },
          { name: 'Bhramari (Humming Bee Breath)', sets: '1', reps: '5 min', rest: '-', cue: 'Keep the hum long. Ear plugs with fingers. Feel vibration.' },
          { name: 'Slow diaphragm breathing', sets: '1', reps: '5–10 min', rest: '-', cue: '4-count inhale, 6-count exhale. Belly rises first.' },
          { name: 'Sunlight sitting', sets: '1', reps: '10 min', rest: '-', cue: 'Balcony or terrace. Face the sun gently. No phone.' },
        ],
      },
      {
        label: 'Evening Care',
        type: 'mobility',
        exercises: [
          { name: 'Steam inhalation', sets: '1', reps: '5–7 min', rest: '-', cue: 'Bowl + hot water + towel over head. Eyes closed. Breathe through nose.' },
          { name: 'Ginger-tulsi drink', sets: '1', reps: '1 cup', rest: '-', cue: 'Boil tulsi leaves + ginger slice in water. Drink warm.' },
          { name: 'Easy 20-min walk', sets: '1', reps: '20 min', rest: '-', cue: 'Flat pace. Should be able to talk comfortably. No rushing.' },
        ],
      },
      {
        label: 'Night Wind-Down',
        type: 'rest',
        exercises: [
          { name: 'Warm water or haldi milk', sets: '1', reps: '1 glass', rest: '-', cue: '1/4 tsp turmeric in warm milk or water. Anti-inflammatory.' },
          { name: 'Sleep before 11:00 PM', sets: '1', reps: '7–8 hr', rest: '-', cue: 'Phone away by 10:30 PM. Dark room. Head slightly elevated.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PHASE 1: Foundation
  // ─────────────────────────────────────────────────────────
  {
    id: 1,
    name: 'Foundation',
    subtitle: 'Build the Base',
    duration: '6 Weeks',
    durationWeeks: 6,
    rank: 'E',
    description: 'Pre-calisthenics groundwork. Fix stiff joints, build basic stamina, and learn controlled movement. No full push-ups, no running. Every rep must look clean.',
    calorieTarget: '2,450–2,650 kcal',
    proteinTarget: '100–115 g',
    readiness: {
      checks: [
        'Walk 30–40 min briskly without chest tightness or extreme breathlessness',
        '3 × 12 wall or incline push-ups with clean form',
        '3 × 15 chair squats without knee pain',
        '3 × 15 glute bridges with full control',
        '2 × 8 bird dogs per side without twisting',
        'Mobility session completed without sharp joint pain',
      ],
    },
    schedule: [
      {
        label: 'Strength A',
        type: 'strength',
        cardioNote: '20–30 min walk after. Conversational pace.',
        exercises: [
          { name: 'Chair Squat / Sit-to-Stand', sets: '3', reps: '8–12', rest: '60–75 s', cue: 'Stand fully tall. Knees track over toes. No caving in.' },
          { name: 'Wall Push-Up', sets: '3', reps: '8–12', rest: '60 s', cue: 'Body perfectly straight. Lower chest to wall slowly.' },
          { name: 'Glute Bridge', sets: '3', reps: '10–15', rest: '45–60 s', cue: 'Drive through heels. Squeeze glutes at top. Low back stays neutral.' },
          { name: 'Bird Dog', sets: '2', reps: '6 per side', rest: '45 s', cue: 'No rotation. Reach arm and opposite leg long simultaneously.' },
          { name: 'Calf Raise', sets: '3', reps: '12–20', rest: '30–45 s', cue: '2 seconds up, 2 seconds down. Full range.' },
          { name: 'Chin Tuck', sets: '2', reps: '10', rest: '30 s', cue: 'Head pulls straight back, not down. Double chin formation is correct.' },
        ],
      },
      {
        label: 'Strength B',
        type: 'strength',
        cardioNote: '20–30 min walk after. Controlled breathing throughout.',
        exercises: [
          { name: 'Chair Squat (3-sec lowering)', sets: '3', reps: '8–10', rest: '60–75 s', cue: 'Count 3 seconds descending. Control is the point, not speed.' },
          { name: 'Dead Bug', sets: '3', reps: '6 per side', rest: '45 s', cue: 'Low back must stay pressed to floor. Move arm and opposite leg together.' },
          { name: 'Wall Slide / Wall Angel', sets: '2', reps: '8–12', rest: '30–45 s', cue: 'Back of hands touch wall. Ribs down. Slide arms overhead slowly.' },
          { name: 'Glute Bridge Hold', sets: '3', reps: '20–30 s', rest: '45 s', cue: 'Hold at top. Squeeze hard. Breathe normally.' },
          { name: 'Calf Raise', sets: '3', reps: '15', rest: '30–45 s', cue: 'Use support if needed for balance. Slow controlled movement.' },
          { name: 'Incline Push-Up', sets: '2–3', reps: '8–10', rest: '60 s', cue: 'Progress from wall to desk or chair. Body stays rigid.' },
        ],
      },
      {
        label: 'Mobility Day',
        type: 'mobility',
        cardioNote: '20–25 min easy walk. Very light effort.',
        exercises: [
          { name: 'March in Place', sets: '1', reps: '60–90 s', rest: '-', cue: 'Warm up joints. Exaggerate knee lift slightly.' },
          { name: 'Cat-Cow', sets: '2', reps: '8', rest: '-', cue: 'Full arch on cow, full round on cat. Breathe with each.' },
          { name: 'Hip Flexor Stretch', sets: '2', reps: '20–30 s per side', rest: '-', cue: 'Lunge position. Back knee down. Push hips forward gently.' },
          { name: 'Hamstring Stretch', sets: '2', reps: '20–30 s per side', rest: '-', cue: 'Seated or lying. No bouncing. Hold mild tension only.' },
          { name: "Child's Pose", sets: '2', reps: '30 s', rest: '-', cue: 'Arms forward. Hips back toward heels. Breathe into lower back.' },
          { name: 'Knee-to-Wall Ankle Mobility', sets: '2', reps: '8 per side', rest: '-', cue: 'Big toe stays on floor. Knee tracks over toes.' },
          { name: 'Chin Tuck', sets: '2', reps: '10', rest: '-', cue: 'Correct forward-head posture.' },
          { name: 'Wall Slide', sets: '2', reps: '8', rest: '-', cue: 'Upper-back and shoulder posture.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PHASE 2: Sleeper Build I
  // ─────────────────────────────────────────────────────────
  {
    id: 2,
    name: 'Sleeper Build I',
    subtitle: 'The Body Begins to Change',
    duration: '12 Weeks',
    durationWeeks: 12,
    rank: 'D',
    description: 'Proper calisthenics begins. 4-day split: Push, Legs, Pull, Full Body. Backpack loading when bodyweight gets easy. The "sleeper" look — stronger than you appear.',
    calorieTarget: '2,550–2,850 kcal',
    proteinTarget: '110–125 g',
    readiness: {
      checks: [
        '15–20 clean floor push-ups',
        '8–12 pike push-ups without shoulder pain',
        '12 clean reverse lunges per leg',
        '12 Bulgarian split squats per leg with control',
        '30–40 second hollow hold',
        '40+ second plank',
        '20–30 second dead hang without discomfort',
        'Brisk walking no longer destroys breathing',
      ],
    },
    schedule: [
      {
        label: 'Workout A — Push & Core',
        type: 'strength',
        exercises: [
          { name: 'Incline / Floor Push-Up', sets: '4', reps: '8–12', rest: '90 s', cue: 'Perfect body line. Elbows 45°. Chest touches surface.' },
          { name: 'Pike Push-Up', sets: '3', reps: '6–8', rest: '90 s', cue: 'Inverted V position. Head goes between arms. Shoulder focus.' },
          { name: 'Push-Up Top Hold', sets: '3', reps: '20 sec', rest: '60 s', cue: 'Arms locked. Core tight. Shoulders actively pushing away from floor.' },
          { name: 'Front Plank', sets: '3', reps: '20–30 sec', rest: '60 s', cue: 'Hips level. Glutes squeezed. Head neutral. Breathe steadily.' },
          { name: 'Hollow Tuck Hold', sets: '3', reps: '15–20 sec', rest: '60 s', cue: 'Lower back pressed to floor. Arms overhead. Knees to chest.' },
        ],
      },
      {
        label: 'Workout B — Legs & Conditioning',
        type: 'strength',
        exercises: [
          { name: 'Bodyweight Squat', sets: '4', reps: '10–15', rest: '90 s', cue: 'Hip-width. Knees out. Chest tall. Full depth without pain.' },
          { name: 'Reverse Lunge', sets: '3', reps: '8–10 per leg', rest: '75 s', cue: 'Step back. Front shin vertical. Back knee hovers above floor.' },
          { name: 'Single-Leg Glute Bridge', sets: '3', reps: '8–10 per leg', rest: '60 s', cue: 'One leg extended. Drive hard through planted heel. Hold top 1 sec.' },
          { name: 'Standing Calf Raise', sets: '4', reps: '15–20', rest: '45 s', cue: 'Full extension at top. Slow controlled descent.' },
          { name: 'Brisk Walk Finish', sets: '1', reps: '10–12 min', rest: '-', cue: 'Easy but purposeful pace. Cool down.' },
        ],
      },
      {
        label: 'Workout C — Pull & Posture',
        type: 'strength',
        exercises: [
          { name: 'Backpack Bent-Over Row', sets: '4', reps: '10–15', rest: '90 s', cue: 'Hinge at hips. Back flat. Pull pack to lower chest. Squeeze shoulder blades.' },
          { name: 'Band Row / Assisted Row', sets: '3', reps: '12–15', rest: '75 s', cue: 'Anchor band at waist height. Pull elbows back. Chest stays still.' },
          { name: 'Dead Hang', sets: '3', reps: '15–20 sec', rest: '75 s', cue: 'Full grip. Shoulders active (slightly pulled back). Breathe.' },
          { name: 'Prone Y-T-W Raises', sets: '2', reps: '6 each position', rest: '60 s', cue: 'Face down. Arms in Y, T, and W positions. Lift only to hip height.' },
          { name: 'Side Plank', sets: '3', reps: '20–25 sec per side', rest: '60 s', cue: 'Hips stacked. Top arm on hip. Body straight as a board.' },
        ],
      },
      {
        label: 'Workout D — Full Body Sleeper',
        type: 'strength',
        exercises: [
          { name: 'Push-Up (main set)', sets: '3', reps: 'Stop 2 before failure', rest: '120 s', cue: 'Quality over quantity. Every rep clean. Same body line.' },
          { name: 'Bulgarian Split Squat', sets: '3', reps: '8–10 per leg', rest: '90 s', cue: 'Rear foot elevated. Front shin vertical. Drop straight down.' },
          { name: 'Pike Push-Up', sets: '3', reps: '6–8', rest: '90 s', cue: 'Shoulder press movement on the floor. Controlled.' },
          { name: 'Hanging Knee Raise', sets: '3', reps: '8–10', rest: '75 s', cue: 'Hang still first. Bring knees up controlled. No swinging.' },
          { name: 'Mountain Climbers', sets: '3', reps: '20 sec on', rest: '40 s', cue: 'Hands under shoulders. Drive knees alternately. Hips stay level.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PHASE 3: Sleeper Build II
  // ─────────────────────────────────────────────────────────
  {
    id: 3,
    name: 'Sleeper Build II',
    subtitle: 'Harder. Heavier. Sharper.',
    duration: '12 Weeks',
    durationWeeks: 12,
    rank: 'D',
    description: 'Harder variations of Phase 2. Backpack loading replaces bodyweight when reps get easy. Weeks 5–8 add volume; weeks 9–12 introduce more demanding progressions.',
    calorieTarget: '2,600–2,900 kcal',
    proteinTarget: '115–130 g',
    readiness: {
      checks: [
        '20+ clean push-ups with full control',
        '10+ pike push-ups without arm shaking',
        '15 Bulgarian split squats per leg cleanly',
        '40+ second hollow hold',
        '30+ second dead hang',
        'Consistent 4-day training for 12 weeks without skipping more than 2 sessions',
      ],
    },
    schedule: [
      {
        label: 'Workout A — Push & Core (Harder)',
        type: 'strength',
        exercises: [
          { name: 'Floor Push-Up / Backpack Push-Up', sets: '4', reps: '10–15', rest: '90 s', cue: 'Add backpack when 15 reps feel easy. Load gradually.' },
          { name: 'Pike Push-Up (Feet-Elevated)', sets: '4', reps: '6–10', rest: '90 s', cue: 'Feet on chair, hips high. More shoulder load.' },
          { name: 'Push-Up Hold (Longer)', sets: '3', reps: '25–30 sec', rest: '60 s', cue: 'Maintain shaky control. That tension is the work.' },
          { name: 'Front Plank (Longer)', sets: '3', reps: '30–40 sec', rest: '60 s', cue: 'Squeezing everything. No sagging.' },
          { name: 'Hollow Body Hold', sets: '3', reps: '20–25 sec', rest: '60 s', cue: 'Legs extended now. Lower back stays down. Arms overhead.' },
        ],
      },
      {
        label: 'Workout B — Legs & Conditioning (Harder)',
        type: 'strength',
        exercises: [
          { name: 'Tempo Squat (3-1-1)', sets: '4', reps: '15–20', rest: '90 s', cue: '3 sec down, 1 pause, 1 fast up. Brutal quad work.' },
          { name: 'Reverse Lunge', sets: '4', reps: '8–12 per leg', rest: '75 s', cue: 'Add backpack for extra load. Keep torso upright.' },
          { name: 'Single-Leg Glute Bridge', sets: '3', reps: '10–12 per leg', rest: '60 s', cue: 'Drive hard. Hold 2 seconds at top each rep.' },
          { name: 'Single-Leg Calf Raise (with pause)', sets: '4', reps: '15–20', rest: '45 s', cue: '1 second pause at full extension. Burns are normal.' },
          { name: 'Brisk Walk Finish', sets: '1', reps: '12–15 min', rest: '-', cue: 'Purposeful pace. Lower-body flush.' },
        ],
      },
      {
        label: 'Workout C — Pull & Posture (Harder)',
        type: 'strength',
        exercises: [
          { name: 'Backpack Row (Heavier)', sets: '4', reps: '12–15', rest: '90 s', cue: 'More load. Same form. Elbows close to body on pull.' },
          { name: 'Band Row (Stronger Tension)', sets: '4', reps: '10–15', rest: '75 s', cue: 'If band too easy, add a second band or tie at a harder angle.' },
          { name: 'Scapular Pull-Up / Dead Hang', sets: '3', reps: '20–30 sec', rest: '75 s', cue: 'From hang, squeeze shoulder blades DOWN without bending arms. Activate lats.' },
          { name: 'Prone Y-T-W', sets: '3', reps: '6–8 each', rest: '60 s', cue: 'Add very light weight (500g) if available. Rear delts and traps.' },
          { name: 'Side Plank (Longer)', sets: '3', reps: '25–30 sec per side', rest: '60 s', cue: 'Raise top leg for extra challenge if stable.' },
        ],
      },
      {
        label: 'Workout D — Full Body (Harder)',
        type: 'strength',
        exercises: [
          { name: 'Harder Push-Up Variation', sets: '4', reps: 'Stop 1–2 before failure', rest: '120 s', cue: 'Archer push-up, wide grip, or backpack push-up.' },
          { name: 'Bulgarian Split Squat', sets: '4', reps: '8–12 per leg', rest: '90 s', cue: 'Add backpack. Deeper if joints allow. Front knee stays over toes.' },
          { name: 'Pike Push-Up (Shoulder Focus)', sets: '3', reps: '8–10', rest: '90 s', cue: 'Head nearly touches floor. Control ascent.' },
          { name: 'Hanging Knee Raise', sets: '3', reps: '10–12', rest: '75 s', cue: 'Now aim for straight-leg raises if hanging knee is easy.' },
          { name: 'Mountain Climbers', sets: '4', reps: '25 sec on', rest: '35 s', cue: 'Faster pace. Maintain hip position. Breathe hard — thats ok.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PHASE 4: Calisthenics Core
  // ─────────────────────────────────────────────────────────
  {
    id: 4,
    name: 'Calisthenics Core',
    subtitle: 'The Skill Phase Begins',
    duration: '10 Weeks',
    durationWeeks: 10,
    rank: 'C',
    description: 'Skill-based calisthenics. L-sit, planche lean, tuck hold. Your core becomes the foundation of everything advanced that follows.',
    calorieTarget: '2,600–2,900 kcal',
    proteinTarget: '120–130 g',
    readiness: {
      checks: [
        '25 clean push-ups',
        '15 pike push-ups',
        '20+ Bulgarian split squats per leg',
        '45+ second hollow body hold',
        '45+ second front plank',
        '35+ second dead hang with active shoulders',
      ],
    },
    schedule: [
      {
        label: 'Core Skill Day',
        type: 'strength',
        exercises: [
          { name: 'L-Sit Tuck Hold (on chairs/parallettes)', sets: '5', reps: '5–10 sec', rest: '90 s', cue: 'Arms fully locked. Knees pulled to chest. Depress shoulders.' },
          { name: 'Planche Lean', sets: '4', reps: '5–10 sec', rest: '75 s', cue: 'Lean forward in push-up position until heels almost lift. Protract shoulders.' },
          { name: 'Hollow Body Hold (Extended)', sets: '4', reps: '25–35 sec', rest: '60 s', cue: 'Arms fully overhead. Legs out. Lower back on floor.' },
          { name: 'Dead Bug (Weighted / Slower)', sets: '3', reps: '6 per side', rest: '60 s', cue: '4-second extension. Arms overhead. Spine neutral.' },
          { name: 'Ab Wheel / Dragon Flag Tuck', sets: '3', reps: '6–8', rest: '90 s', cue: 'Ab wheel if available. Otherwise: Dragon flag with tucked knees on bench.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PHASE 5: Pull Mastery
  // ─────────────────────────────────────────────────────────
  {
    id: 5,
    name: 'Pull Mastery',
    subtitle: 'The Back Takes Over',
    duration: '10 Weeks',
    durationWeeks: 10,
    rank: 'C',
    description: 'Achieve your first clean pull-up, then stack reps. Rows, hangs, scapular work, and pull-up negatives build the strongest back of your life.',
    calorieTarget: '2,650–2,950 kcal',
    proteinTarget: '125–135 g',
    readiness: {
      checks: [
        '1 clean dead hang for 45+ seconds',
        'Scapular pull-up for 5 controlled reps',
        'Consistent pull-up negative (5+ seconds lowering)',
        'Band-assisted pull-up for 8+ reps',
      ],
    },
    schedule: [
      {
        label: 'Pull Progression Day',
        type: 'strength',
        exercises: [
          { name: 'Scapular Pull-Up', sets: '4', reps: '8–10', rest: '75 s', cue: 'From dead hang: depress shoulders (pull down) without bending arms. 2 sec hold.' },
          { name: 'Pull-Up Negative', sets: '5', reps: '5 sec lowering', rest: '120 s', cue: 'Jump or step to top. Lower for 5 full seconds. Do not let go fast.' },
          { name: 'Band-Assisted Pull-Up', sets: '4', reps: '5–8', rest: '120 s', cue: 'Use band around foot. Focus on pulling elbows DOWN, not hands up.' },
          { name: 'Australian Row (Table/Bar)', sets: '4', reps: '8–12', rest: '90 s', cue: 'Body rigid under bar at waist height. Pull chest to bar.' },
          { name: 'Dead Hang x2', sets: '3', reps: '30–45 sec', rest: '90 s', cue: 'Active hang: shoulders pulled slightly back. Grip alternates.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PHASE 6: Push Mastery
  // ─────────────────────────────────────────────────────────
  {
    id: 6,
    name: 'Push Mastery',
    subtitle: 'Shoulder Power Unlocked',
    duration: '10 Weeks',
    durationWeeks: 10,
    rank: 'C',
    description: 'Progress from pike push-up to handstand push-up (HSPU). Shoulder pressing strength, tricep lockout, and wrist preparation for advanced skills.',
    calorieTarget: '2,650–2,950 kcal',
    proteinTarget: '125–135 g',
    readiness: {
      checks: [
        '12+ feet-elevated pike push-ups',
        '30 clean floor push-ups',
        'Wall handstand hold for 10+ seconds',
        '10 sec controlled planche lean',
      ],
    },
    schedule: [
      {
        label: 'Push Skill Day',
        type: 'strength',
        exercises: [
          { name: 'Wall Handstand Hold', sets: '5', reps: '10–20 sec', rest: '90 s', cue: 'Face wall. Walk hands close. Balance on straight arms. Active shoulders.' },
          { name: 'Feet-Elevated Pike Push-Up', sets: '4', reps: '8–12', rest: '120 s', cue: 'Hips high. Head between arms on way down. Forehead near floor.' },
          { name: 'Deficit Push-Up', sets: '4', reps: '8–10', rest: '90 s', cue: 'Hands on books or fists. Chest drops below hand level. Extended range.' },
          { name: 'Pseudo Planche Push-Up', sets: '3', reps: '6–8', rest: '90 s', cue: 'Fingers back. Lean forward. Elbows graze sides. Straight body.' },
          { name: 'Tricep Dip (Chair/Parallel)', sets: '4', reps: '10–15', rest: '75 s', cue: 'Elbows track back, not out. Lower until 90° at elbow. Push up fully.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PHASE 7: Leg Mastery
  // ─────────────────────────────────────────────────────────
  {
    id: 7,
    name: 'Leg Mastery',
    subtitle: 'The Lower Body Awakens',
    duration: '10 Weeks',
    durationWeeks: 10,
    rank: 'B',
    description: 'Progress to pistol squats. Add shrimp squats and single-leg work that builds the leg strength of a gymnast.',
    calorieTarget: '2,700–3,000 kcal',
    proteinTarget: '130–140 g',
    readiness: {
      checks: [
        '20+ Bulgarian split squats per leg',
        'Single-leg squat to box (controlled)',
        'Good ankle mobility (knee-to-wall 10+ cm)',
        '30+ minute run at conversational pace',
      ],
    },
    schedule: [
      {
        label: 'Leg Skill Day',
        type: 'strength',
        exercises: [
          { name: 'Assisted Pistol Squat (TRX/band/pole)', sets: '4', reps: '5–8 per leg', rest: '120 s', cue: 'Hold support lightly. Lower slowly. Free leg extended forward.' },
          { name: 'Shrimp Squat (assisted)', sets: '3', reps: '5–6 per leg', rest: '90 s', cue: 'Rear foot held behind. Knee lowers toward floor. Torso upright.' },
          { name: 'Nordic Hamstring Curl', sets: '3', reps: '4–6', rest: '120 s', cue: 'Anchor feet under something heavy. Lower torso forward slowly. Catch or push back.' },
          { name: 'Step-Up to Hold', sets: '3', reps: '8 per leg', rest: '75 s', cue: 'Drive through front heel. Stand on one leg on box for 2 sec.' },
          { name: 'Single-Leg Calf Raise with Pause', sets: '4', reps: '15–20', rest: '45 s', cue: 'Top position: 2 sec hold. Bottom: light stretch only.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PHASE 8: Full Body Power
  // ─────────────────────────────────────────────────────────
  {
    id: 8,
    name: 'Full Body Power',
    subtitle: 'Explosive Capacity',
    duration: '12 Weeks',
    durationWeeks: 12,
    rank: 'B',
    description: 'Introduce explosive training: clapping push-ups, jump squats, sprinting, and muscle-up preparation. Your entire body works as one unit.',
    calorieTarget: '2,800–3,100 kcal',
    proteinTarget: '135–145 g',
    readiness: {
      checks: [
        '30+ clean push-ups',
        '8+ pull-ups (if bar available) or negatives under 8+ seconds',
        'Pistol squat 5+ reps per leg',
        'Good sprint capacity (400m comfortably)',
        'No chronic joint pain in elbows/knees/shoulders',
      ],
    },
    schedule: [
      {
        label: 'Power Day A',
        type: 'strength',
        exercises: [
          { name: 'Clapping Push-Up (or fast push-up)', sets: '4', reps: '5–8', rest: '120 s', cue: 'Fast descent, explosive push. If no clap yet: just aim to get hands off floor.' },
          { name: 'Jump Squat', sets: '4', reps: '8–10', rest: '90 s', cue: 'Soft landing. Deep squat. Explode fully. Land quietly on toes first.' },
          { name: 'Muscle-Up Transition Drill', sets: '5', reps: '5', rest: '120 s', cue: 'From top of pull: lean chest over bar. Turn wrists over. Transition is the skill.' },
          { name: 'Sprint Interval', sets: '6', reps: '30 sec fast / 90 sec easy', rest: '-', cue: 'Not 100% effort. Around 80% intensity. No wheezing. Control breathing.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PHASE 9: Elite Body
  // ─────────────────────────────────────────────────────────
  {
    id: 9,
    name: 'Elite Body',
    subtitle: 'The Awakening Approaches',
    duration: '12 Weeks',
    durationWeeks: 12,
    rank: 'A',
    description: 'Advanced calisthenics skills. Muscle-up, front lever progressions, back lever, freestanding handstand push-up prep. Limited only by your discipline.',
    calorieTarget: '2,900–3,200 kcal',
    proteinTarget: '140–150 g',
    readiness: {
      checks: [
        '1 clean muscle-up',
        'Tuck front lever hold for 5+ seconds',
        'Handstand hold for 20+ seconds',
        'HSPU with band assistance',
        'Full pistol squat 10+ reps per leg',
      ],
    },
    schedule: [
      {
        label: 'Elite Skill Day',
        type: 'strength',
        exercises: [
          { name: 'Muscle-Up', sets: '5', reps: '1–5', rest: '180 s', cue: 'False grip or standard. Explosive pull, fast transition, lockout fully.' },
          { name: 'Tuck Front Lever', sets: '5', reps: '5–10 sec', rest: '120 s', cue: 'Hips at bar height. Tuck knees. Pull bar to hips. Paralell to floor.' },
          { name: 'Handstand Push-Up (wall-assisted)', sets: '4', reps: '5–8', rest: '120 s', cue: 'Kick to wall. Lower head between hands slowly. Push fully.' },
          { name: 'Tuck Back Lever', sets: '4', reps: '5–8 sec', rest: '120 s', cue: 'Face up. Tuck hips. Body parallel to floor. Bicep skin-the-cat entry.' },
          { name: 'One-Arm Push-Up (knees)', sets: '3', reps: '5 per arm', rest: '120 s', cue: 'Wide leg base. Free arm tucked, not behind. Slow. No rotating.' },
        ],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // PHASE 10: Elite Skill Mastery
  // ─────────────────────────────────────────────────────────
  {
    id: 10,
    name: 'Elite Skill Mastery',
    subtitle: 'Gravity Defied',
    duration: '12 Weeks',
    durationWeeks: 12,
    rank: 'S',
    description: 'Perfecting advanced statics. Front levers become solid. Muscle-ups become strict. You are no longer just fit; you possess specialized functional strength.',
    calorieTarget: '2,900–3,300 kcal',
    proteinTarget: '145–155 g',
    readiness: {
      checks: [
        'Strict muscle-ups without kipping',
        '30-second freestanding handstand',
        'Straddle front lever hold',
        'Pistol squats loaded with 10kg+',
      ],
    },
    schedule: [
      {
        label: 'Advanced Mechanics',
        type: 'strength',
        exercises: [
          { name: 'Strict Muscle-Up', sets: '5', reps: '3–5', rest: '180 s', cue: 'No momentum. Pure pull and fast wrist transition.' },
          { name: 'Straddle Front Lever', sets: '5', reps: '10 sec', rest: '120 s', cue: 'Legs wide to reduce leverage. Back absolutely straight.' },
          { name: 'Freestanding HSPU (Negatives)', sets: '4', reps: '3–5', rest: '120 s', cue: 'Kick up, lower as slowly as possible without wall.' },
          { name: 'Weighted Pistol Squat', sets: '4', reps: '6–8 per leg', rest: '120 s', cue: 'Hold a heavy pack or dumbbell. Deep control.' },
          { name: 'Dragon Flag (Full)', sets: '4', reps: '6–8', rest: '90 s', cue: 'Body straight. Pivot rests on upper back/shoulders.' },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────
  // PHASE 11: The One-Arm Path
  // ─────────────────────────────────────────────────────────
  {
    id: 11,
    name: 'The One-Arm Path',
    subtitle: 'Unilateral Extremes',
    duration: '12 Weeks',
    durationWeeks: 12,
    rank: 'S',
    description: 'Developing unilateral power. One-arm push-ups become flawless. Training begins for the one-arm pull-up (OAPU). Balance is tested.',
    calorieTarget: '3,000–3,300 kcal',
    proteinTarget: '145–160 g',
    readiness: {
      checks: [
        'Flawless one-arm push-up (straddle)',
        'One-arm chin-up hold / lock-off at 90 degrees',
        'Archer pull-ups (10 reps)',
      ],
    },
    schedule: [
      {
        label: 'Unilateral Power',
        type: 'strength',
        exercises: [
          { name: 'OAPU Assisted Pulls (Band/Finger)', sets: '5', reps: '2–4 per arm', rest: '180 s', cue: 'Index finger of assist hand only. Pull hard with main arm.' },
          { name: 'Archer Pull-Up', sets: '4', reps: '5–6 per arm', rest: '120 s', cue: 'One arm straight out on bar. Primary arm pulls chest to bar.' },
          { name: 'Perfect One-Arm Push-Up', sets: '4', reps: '5–8 per arm', rest: '120 s', cue: 'Feet closer together than before. No spine rotation.' },
          { name: 'Advanced Pistol Jumps', sets: '3', reps: '4–6 per leg', rest: '90 s', cue: 'Explode up from pistol squat. Land softly on same leg.' },
          { name: 'Windshield Wipers (Bar)', sets: '4', reps: '10–12', rest: '90 s', cue: 'Hang from bar. Legs straight up, rotate side to side.' },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────
  // PHASE 12: National Level Foundation
  // ─────────────────────────────────────────────────────────
  {
    id: 12,
    name: 'National Level Foundation',
    subtitle: 'The Beast Inside',
    duration: '12 Weeks',
    durationWeeks: 12,
    rank: 'National',
    description: 'Your physical limits have shifted drastically. We combine heavy loading with hyper-endurance. Your immunity and energy are operating at 200%.',
    calorieTarget: '3,000–3,400 kcal',
    proteinTarget: '150–165 g',
    readiness: {
      checks: [
        'Weighted pull-up (20kg+)',
        'Planche tuck hold (20 seconds)',
        'Sprint interval recovery under 45 seconds',
      ],
    },
    schedule: [
      {
        label: 'Hybrid Combat Day',
        type: 'strength',
        exercises: [
          { name: 'Weighted Pull-Up (Pack)', sets: '5', reps: '5–6', rest: '180 s', cue: 'Explosive up, control down. Load heavy.' },
          { name: 'Explosive Dips (Clapping/Weighted)', sets: '4', reps: '8–10', rest: '120 s', cue: 'If no weight, explode out of dip so hands leave bars.' },
          { name: 'Advanced Planche Lean + Tuck', sets: '4', reps: '20 sec', rest: '120 s', cue: 'Lean forward and float feet. Huge shoulder strain.' },
          { name: 'Sprint repeats (Max Effort)', sets: '8', reps: '20 sec fast', rest: '40 s', cue: 'Short rest intervals. Build massive VO2 max.' },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────
  // PHASE 13: Absolute Gravity
  // ─────────────────────────────────────────────────────────
  {
    id: 13,
    name: 'Absolute Gravity',
    subtitle: 'Defying Physics',
    duration: '10 Weeks',
    durationWeeks: 10,
    rank: 'National',
    description: 'Transitioning to ring training or advanced bar dynamics. Stabilizer muscles you never knew existed are forged here.',
    calorieTarget: '3,100–3,400 kcal',
    proteinTarget: '155–170 g',
    readiness: {
      checks: [
        'Ring dips (or extremely controlled bar dips)',
        '10+ slow muscle ups',
        'Immaculate body control in space',
      ],
    },
    schedule: [
      {
        label: 'Instability & Rings',
        type: 'strength',
        exercises: [
          { name: 'Ring Muscle-Up (or slow bar MU)', sets: '5', reps: '3–5', rest: '180 s', cue: 'Deep false grip. Transition smoothly.' },
          { name: 'Ring Dips / RTO Dips', sets: '4', reps: '8–10', rest: '120 s', cue: 'Rings turned out at the top of the dip. Brutal on chest.' },
          { name: 'Front Lever Pull-Ups', sets: '4', reps: '4–6', rest: '120 s', cue: 'Hold front lever horizontal, then pull chest to bar.' },
          { name: 'Nordic Curls (Unassisted)', sets: '4', reps: '5–8', rest: '90 s', cue: 'Zero hands used on descent. Pure hamstring strength.' },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────
  // PHASE 14: Shadow Infusion
  // ─────────────────────────────────────────────────────────
  {
    id: 14,
    name: 'Shadow Infusion',
    subtitle: 'Unbreakable Core',
    duration: '10 Weeks',
    durationWeeks: 10,
    rank: 'National',
    description: 'Focus shifts entirely to creating a core made of iron. Human flag progressions and iron cross preparation.',
    calorieTarget: '3,200–3,500 kcal',
    proteinTarget: '160–175 g',
    readiness: {
      checks: [
        'Tuck human flag holds',
        '20+ hanging toes-to-bar',
        'Solid straddle planche (attempts)',
      ],
    },
    schedule: [
      {
        label: 'Flag & Iron Core',
        type: 'strength',
        exercises: [
          { name: 'Human Flag (Tuck/Straddle)', sets: '5', reps: '5–10 sec/side', rest: '150 s', cue: 'Push with bottom arm, pull with top. Lock core.' },
          { name: 'Straddle Planche Push-Ups (or tuck)', sets: '4', reps: '4–6', rest: '150 s', cue: 'Feet off floor. Press up.' },
          { name: 'Hanging Toes to Bar (Strict)', sets: '4', reps: '12–15', rest: '90 s', cue: 'No swinging back. Pure abdominal compression.' },
          { name: 'Weighted Hollow Holds', sets: '3', reps: '45 sec', rest: '60 s', cue: 'Hold pack extended over chest. Crush lower back to earth.' },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────
  // PHASE 15: The Ruler\'s Hand
  // ─────────────────────────────────────────────────────────
  {
    id: 15,
    name: 'The Ruler\'s Hand',
    subtitle: 'Iron Grip. Lethal Pull.',
    duration: '10 Weeks',
    durationWeeks: 10,
    rank: 'National',
    description: 'Your grip strength becomes abnormal. One-arm pull-ups are finalized. Fingers have tendons of steel.',
    calorieTarget: '3,200–3,600 kcal',
    proteinTarget: '165–180 g',
    readiness: {
      checks: [
        'True one-arm pull up achieved (or 95% there)',
        'One-arm dead hang for 45+ seconds/arm',
      ],
    },
    schedule: [
      {
        label: 'Grip & Unilateral Supremacy',
        type: 'strength',
        exercises: [
          { name: 'One-Arm Pull-Up', sets: '5', reps: '1–3 per arm', rest: '180 s', cue: 'The ultimate back test. Clean form.' },
          { name: 'Fingertip Push-Ups', sets: '4', reps: '15–20', rest: '90 s', cue: 'On fingertips. Builds massive hand/forearm strength.' },
          { name: 'Towel/Rope Pull-Ups', sets: '4', reps: '10–12', rest: '120 s', cue: 'Crush grip on towels folded over bar.' },
          { name: 'Explosive Pistol Squat Jumps (Weight vest)', sets: '4', reps: '5/leg', rest: '120 s', cue: 'Maximum leg explosiveness on single leg.' },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────
  // PHASE 16: Monarch\'s Domain
  // ─────────────────────────────────────────────────────────
  {
    id: 16,
    name: 'Monarch\'s Domain',
    subtitle: 'Absolute Control',
    duration: '10 Weeks',
    durationWeeks: 10,
    rank: 'National',
    description: 'Combining dynamic and static movements. Muscle-ups directly into front levers. The flow state of pure physical dominance.',
    calorieTarget: '3,200–3,600 kcal',
    proteinTarget: '165–180 g',
    readiness: {
      checks: [
        'Seamless transitions between complex movements',
        'No lingering injuries or joint weaknesses',
      ],
    },
    schedule: [
      {
        label: 'Flow & Complex Days',
        type: 'strength',
        exercises: [
          { name: 'Muscle-Up to Front Lever Combo', sets: '5', reps: '2–3 complexes', rest: '180 s', cue: 'Up, strict, hold front lever on descent.' },
          { name: '90-Degree Handstand Push-Up', sets: '4', reps: '3–5', rest: '150 s', cue: 'From handstand, lower into bent-arm planche, push back up.' },
          { name: 'Full Human Flag Hold', sets: '4', reps: '10+ sec/side', rest: '120 s', cue: 'Legs zipped together. Total immobility.' },
          { name: 'Dragon Pistol Squats', sets: '3', reps: '8 per leg', rest: '90 s', cue: 'Free leg wraps behind the squat leg. Extreme balance.' },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────
  // PHASE 17: Awakening Trial
  // ─────────────────────────────────────────────────────────
  {
    id: 17,
    name: 'Awakening Trial',
    subtitle: 'The Final Test',
    duration: '4 Weeks',
    durationWeeks: 4,
    rank: 'National',
    description: 'A 4-week brutal test of endurance, power, and mental fortitude. Prove that the boy who started at E-Rank is truly gone.',
    calorieTarget: '3,200–3,600 kcal',
    proteinTarget: '165–180 g',
    readiness: {
      checks: [
        'Mastery of all previous skills',
        'Zero allergy/immunity setbacks this year',
      ],
    },
    schedule: [
      {
        label: 'The Crucible',
        type: 'strength',
        exercises: [
          { name: 'The 100/100/100', sets: '1', reps: 'For Time', rest: '-', cue: '100 Pull-ups, 100 push-ups, 100 pistols. As fast as possible.' },
          { name: 'Static Isolation Holds', sets: '1', reps: 'Max Time', rest: '-', cue: 'Hold FL, Planche, Handstand to absolute failure.' },
          { name: 'Endurance Sprint', sets: '1', reps: '5km fast', rest: '-', cue: 'Sub-20 minute goal. Cardiovascular peak.' },
        ],
      },
    ],
  },
  // ─────────────────────────────────────────────────────────
  // PHASE 18: The Shadow Monarch
  // ─────────────────────────────────────────────────────────
  {
    id: 18,
    name: 'The Shadow Monarch',
    subtitle: 'Arise.',
    duration: 'Ongoing',
    durationWeeks: 999,
    rank: 'Shadow Monarch',
    description: 'You have conquered the system. Your body is a weapon. Your mind is an unparalleled fortress. You no longer need the system — you ARE the system.',
    calorieTarget: '3,200–3,600 kcal',
    proteinTarget: '165–180 g',
    readiness: {
      checks: [
        'You are reading this.',
        'The host is fully optimized.',
        'Allergy chains have been broken.',
      ],
    },
    schedule: [
      {
        label: 'Monarch Routine',
        type: 'strength',
        exercises: [
          { name: 'Absolute Freedom', sets: '∞', reps: 'Max Quality', rest: 'Intuitive', cue: 'Train what you desire. Maintain your empire.' },
        ],
      },
    ],
  },
];
