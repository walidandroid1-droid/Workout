import React from 'react';

import imgPompes from '../assets/images/ex_pompes_1779447126479.png';
import imgSquats from '../assets/images/ex_squats_1779447140608.png';
import imgClimbers from '../assets/images/ex_climbers_1779447161431.png';
import imgFentes from '../assets/images/ex_fentes_1779447177517.png';
import imgBurpees from '../assets/images/ex_burpees_1779447195376.png';
import imgDips from '../assets/images/ex_dips_1779447214855.png';
import imgPlanche from '../assets/images/ex_planche_1779447231310.png';
import imgTwist from '../assets/images/ex_twist_1779447244500.png';
import imgSauts from '../assets/images/ex_sauts_1779447265076.png';

import imgWarmupJacks from '../assets/images/ex_warmup_jumping_jacks_1779447725912.png';
import imgWarmupRotations from '../assets/images/ex_warmup_rotations_bras_1779447746802.png';
import imgWarmupGenoux from '../assets/images/ex_warmup_montee_genoux_1779447766281.png';
import imgWarmupTalons from '../assets/images/ex_warmup_talons_fesses_1779447785831.png';
import imgWarmupSquatsLegers from '../assets/images/ex_warmup_squats_legers_1779447803823.png';
import imgWarmupPlancheActive from '../assets/images/ex_warmup_planche_active_1779447821690.png';

interface ExerciseAnimatorProps {
  exerciseId: number; // 1-10, -1 for warmup, -2 for cooldown
  exerciseName: string;
  isPaused: boolean;
  isWarmup?: boolean;
  isCooldown?: boolean;
}

export const ExerciseAnimator: React.FC<ExerciseAnimatorProps> = ({
  exerciseId,
  exerciseName,
  isPaused,
  isWarmup = false,
  isCooldown = false,
}) => {
  const normName = exerciseName.toLowerCase();

  // Helper to get targeted muscle group text
  const getMuscleTarget = () => {
    if (isWarmup || exerciseId === -1) {
      if (normName.includes("jumping") || normName.includes("jack")) return "Tout le corps / Cardio";
      if (normName.includes("rotation") || normName.includes("bras")) return "Épaules & Mobilité";
      if (normName.includes("genoux") || normName.includes("mont")) return "Fléchisseurs Hanche / Cardio";
      if (normName.includes("fesses") || normName.includes("talon")) return "Ischio-Jambiers / Cardio";
      if (normName.includes("squat")) return "Cuisses & Fessiers";
      return "Échauffement Général";
    }
    if (isCooldown || exerciseId === -2) {
      if (normName.includes("respir") || normName.includes("calme")) return "Détente thoracique / Diaphragme";
      if (normName.includes("étir") || normName.includes("stretch") || normName.includes("quad")) return "Flexibilité Quadriceps";
      return "Relaxation Globale";
    }

    switch (exerciseId) {
      case 1: return "Pectoraux, Triceps & Gainage";
      case 2: return "Quadriceps, Fessiers & Lombaires";
      case 3: return "Abdominaux, Cardio & Épaules";
      case 4: return "Quadriceps, Ischio-Jambiers & Fessiers";
      case 5: return "Cardio, Pectoraux & Explosivité";
      case 6: return "Triceps, Pectoraux (bas) & Épaules";
      case 7: return "Sangle Abdominale Profonde & Tronc";
      case 8: return "Abdominaux Obliques & Taille";
      case 9: return "Fessiers, Mollets & Explosivité pliométrique";
      default: return "Muscles Sollicités";
    }
  };

  // Helper to get target contraction/intensity score
  const getIntensityScore = () => {
    if (isWarmup || exerciseId === -1) return 30;
    if (isCooldown || exerciseId === -2) return 15;
    switch (exerciseId) {
      case 1: return 85;
      case 2: return 80;
      case 3: return 75;
      case 4: return 70;
      case 5: return 95;
      case 6: return 80;
      case 7: return 95;
      case 8: return 75;
      case 9: return 90;
      default: return 50;
    }
  };

  // Helper to render beautiful static SVG blueprints for each exercise
  const renderExerciseBlueprint = (panel: 'DEPART' | 'ACTION') => {
    const isDepart = panel === 'DEPART';

    // 1. WARMUP EXERCISES
    if (isWarmup || exerciseId === -1) {
      if (normName.includes("jumping") || normName.includes("jack")) {
        // Jumping Jacks
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Floor */}
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />
            {/* Body */}
            <circle cx="50" cy="30" r="6" fill="#0f172a" />
            <line x1="50" y1="36" x2="50" y2="60" /> {/* Spine */}
            <line x1="50" y1="60" x2="44" y2="85" /> {/* Leg L - closed */}
            <line x1="50" y1="60" x2="56" y2="85" /> {/* Leg R - closed */}
            <line x1="50" y1="42" x2="38" y2="58" /> {/* Arm L - down */}
            <line x1="50" y1="42" x2="62" y2="58" /> {/* Arm R - down */}
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Floor */}
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />
            {/* Body */}
            <circle cx="50" cy="30" r="6" fill="#0f172a" />
            <line x1="50" y1="36" x2="50" y2="60" /> {/* Spine */}
            <line x1="50" y1="60" x2="36" y2="85" /> {/* Leg L - open */}
            <line x1="50" y1="60" x2="64" y2="85" /> {/* Leg R - open */}
            <line x1="50" y1="42" x2="28" y2="22" /> {/* Arm L - up banner */}
            <line x1="50" y1="42" x2="72" y2="22" /> {/* Arm R - up banner */}
            {/* Movement arrows */}
            <path d="M 33 50 Q 25 40 33 30" stroke="#f59e0b" strokeWidth="1.5" />
            <path d="M 67 50 Q 75 40 67 30" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        );
      }

      if (normName.includes("rotation") || normName.includes("bras")) {
        // Rotations des bras
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="50" cy="30" r="6" fill="#0f172a" />
            <line x1="50" y1="36" x2="50" y2="62" />
            <line x1="50" y1="62" x2="42" y2="85" />
            <line x1="50" y1="62" x2="58" y2="85" />
            <line x1="50" y1="42" x2="25" y2="42" /> {/* Arms horizontal */}
            <line x1="50" y1="42" x2="75" y2="42" />
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="50" cy="30" r="6" fill="#0f172a" />
            <line x1="50" y1="36" x2="50" y2="62" />
            <line x1="50" y1="62" x2="42" y2="85" />
            <line x1="50" y1="62" x2="58" y2="85" />
            <line x1="50" y1="42" x2="28" y2="30" /> {/* Arms rotated up */}
            <line x1="50" y1="42" x2="72" y2="30" />
            {/* Rotation arrows */}
            <ellipse cx="25" cy="42" rx="4" ry="12" stroke="#f59e0b" strokeWidth="1.5" />
            <ellipse cx="75" cy="42" rx="4" ry="12" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        );
      }

      if (normName.includes("genoux") || normName.includes("mont")) {
        // Montées de genoux
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="50" cy="30" r="6" fill="#0f172a" />
            <line x1="50" y1="36" x2="50" y2="60" />
            <line x1="50" y1="60" x2="45" y2="85" />
            <line x1="50" y1="60" x2="55" y2="85" />
            <line x1="50" y1="42" x2="38" y2="58" />
            <line x1="50" y1="42" x2="62" y2="58" />
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle cx="48" cy="28" r="6" fill="#0f172a" />
            <line x1="48" y1="34" x2="48" y2="58" />
            <line x1="48" y1="58" x2="54" y2="85" /> {/* Standing leg */}
            {/* Raised knee */}
            <polyline points="48,58 35,55 35,70" />
            {/* Arms pump dynamic */}
            <polyline points="48,42 38,32 32,45" />
            <polyline points="48,42 58,48 64,38" />
            {/* Up arrow */}
            <path d="M 28 72 L 28 55 M 25 61 L 28 55 L 31 61" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        );
      }

      if (normName.includes("fesses") || normName.includes("talon")) {
        // Talons-fesses
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="50" cy="30" r="6" fill="#0f172a" />
            <line x1="50" y1="36" x2="50" y2="60" />
            <line x1="50" y1="60" x2="45" y2="85" />
            <line x1="50" y1="60" x2="55" y2="85" />
            <line x1="50" y1="42" x2="38" y2="58" />
            <line x1="50" y1="42" x2="62" y2="58" />
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />
            <circle cx="52" cy="28" r="6" fill="#0f172a" />
            <line x1="52" y1="34" x2="52" y2="58" />
            <line x1="52" y1="58" x2="52" y2="85" /> {/* Standing leg */}
            {/* Heel kicked to glutes */}
            <polyline points="52,58 42,70 50,68" />
            {/* Arm runners */}
            <polyline points="52,42 42,48 38,38" />
            <polyline points="52,42 64,36 60,24" />
            {/* Kick curve */}
            <path d="M 36 82 Q 32 72 40 68" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        );
      }

      if (normName.includes("squat") || normName.includes("légers")) {
        // Warmup Squats lightweight
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="50" cy="28" r="6" fill="#0f172a" />
            <line x1="50" y1="34" x2="50" y2="58" />
            <line x1="50" y1="58" x2="44" y2="85" />
            <line x1="50" y1="58" x2="56" y2="85" />
            <line x1="50" y1="40" x2="32" y2="40" stopColor="" /> {/* Arms out front */}
            <line x1="50" y1="40" x2="68" y2="40" />
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="50" cy="45" r="6" fill="#0f172a" /> {/* Lower head */}
            <line x1="50" y1="51" x2="50" y2="68" /> {/* Lower body */}
            <polyline points="50,68 38,72 38,85" /> {/* Flex knee */}
            <polyline points="50,68 62,72 62,85" /> {/* Flex knee */}
            <line x1="50" y1="55" x2="28" y2="55" /> {/* Arms stretched in front */}
            <line x1="50" y1="55" x2="72" y2="55" />
            {/* Down arrow */}
            <path d="M 50 30 L 50 42 M 46 38 L 50 42 L 54 38" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        );
      }

      // Default Warmup
      return (
        <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
          <circle cx="50" cy="30" r="6" fill="#0f172a" />
          <line x1="50" y1="36" x2="50" y2="62" />
          <line x1="50" y1="62" x2="44" y2="85" />
          <line x1="50" y1="62" x2="56" y2="85" />
          <polyline points="50,42 35,32 25,44" />
          <polyline points="50,42 65,32 75,44" />
        </g>
      );
    }

    // 2. COOLDOWN EXERCISES
    if (isCooldown || exerciseId === -2) {
      if (normName.includes("respir") || normName.includes("calme")) {
        // Deep breathing
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="50" cy="28" r="6" fill="#0f172a" />
            <line x1="50" y1="34" x2="50" y2="60" />
            <line x1="50" y1="60" x2="44" y2="85" />
            <line x1="50" y1="60" x2="56" y2="85" />
            <line x1="50" y1="42" x2="35" y2="55" /> {/* Arms down */}
            <line x1="50" y1="42" x2="65" y2="55" />
            {/* Small lungs outline icon */}
            <ellipse cx="50" cy="46" rx="4" ry="5" stroke="#0ea5e9" strokeWidth="1.5" />
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="50" cy="26" r="6" fill="#0f172a" />
            <line x1="50" y1="32" x2="50" y2="60" />
            <line x1="50" y1="60" x2="44" y2="85" />
            <line x1="50" y1="60" x2="56" y2="85" />
            <line x1="50" y1="38" x2="28" y2="28" /> {/* Arms grand stretch in air */}
            <line x1="50" y1="38" x2="72" y2="28" />
            {/* Expanded lungs */}
            <ellipse cx="50" cy="45" rx="8" ry="9" stroke="#10b981" strokeWidth="1.5" opacity="0.6" />
            {/* Breathe out stream */}
            <path d="M 46 16 Q 50 12 54 16" stroke="#10b981" strokeWidth="1" />
          </g>
        );
      }

      if (normName.includes("étir") || normName.includes("stretch") || normName.includes("quad")) {
        // Quad stretch
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="50" cy="28" r="6" fill="#0f172a" />
            <line x1="50" y1="34" x2="50" y2="60" />
            <line x1="50" y1="60" x2="44" y2="85" />
            <line x1="50" y1="60" x2="56" y2="85" />
            <line x1="50" y1="42" x2="35" y2="55" />
            <line x1="50" y1="42" x2="65" y2="55" />
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="50" cy="28" r="6" fill="#0f172a" />
            <line x1="50" y1="34" x2="50" y2="58" />
            <line x1="50" y1="58" x2="56" y2="85" /> {/* One standing stable leg */}
            {/* Bent leg held backward */}
            <polyline points="50,58 40,64 45,55" /> 
            {/* Arm stretching and holding foot */}
            <polyline points="50,40 38,44 45,55" />
            {/* Stretch tension arcs */}
            <path d="M 33 65 Q 36 55 42 58" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2,2" />
          </g>
        );
      }

      // Default Cooldown
      return (
        <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
          <circle cx="50" cy="28" r="6" fill="#0f172a" />
          <line x1="50" y1="34" x2="50" y2="60" />
          <line x1="50" y1="60" x2="44" y2="85" />
          <line x1="50" y1="60" x2="56" y2="85" />
          <polyline points="50,42 32,32 25,18" />
          <polyline points="50,42 68,32 75,18" />
        </g>
      );
    }

    // 3. MAIN 10 EXERCISES
    switch (exerciseId) {
      case 1: // POMPES (Pushups)
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Ground */}
            <line x1="5" y1="80" x2="95" y2="80" stroke="#475569" strokeWidth="1.5" />
            {/* Incline plank body (arms extended) */}
            <circle cx="35" cy="40" r="5.5" fill="#0f172a" /> {/* Head */}
            <line x1="38" y1="43" x2="80" y2="68" /> {/* Main spine + legs alignment */}
            <line x1="80" y1="68" x2="83" y2="80" /> {/* Foot pivot to ground */}
            <line x1="48" y1="49" x2="48" y2="80" /> {/* Extended perpendicular arms */}
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Ground */}
            <line x1="5" y1="80" x2="95" y2="80" stroke="#475569" strokeWidth="1.5" />
            {/* Low plank body (arms bent) */}
            <circle cx="33" cy="58" r="5.5" fill="#0f172a" /> {/* Lower Head */}
            <line x1="36" y1="60" x2="78" y2="72" /> {/* Alignment */}
            <line x1="78" y1="72" x2="81" y2="80" /> {/* Legs */}
            <polyline points="46,63 56,54 48,80" /> {/* Sharp deeply bent elbow */}
            {/* Downward direction arrow */}
            <path d="M 45 30 L 45 45 M 40 40 L 45 45 L 50 40" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        );

      case 2: // SQUATS
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            {/* Standing vertical posture */}
            <circle cx="50" cy="24" r="5.5" fill="#0f172a" />
            <line x1="50" y1="30" x2="50" y2="58" /> {/* Straight spine */}
            <line x1="50" y1="58" x2="43" y2="85" /> {/* Leg L */}
            <line x1="50" y1="58" x2="57" y2="85" /> {/* Leg R */}
            <polyline points="50,38 35,38 35,50" strokeWidth="2.2" /> {/* Guard arms folded */}
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            {/* Deep squat profile-inclined posture */}
            <circle cx="44" cy="46" r="5.5" fill="#0f172a" />
            <line x1="44" y1="52" x2="35" y2="68" /> {/* Tilted torso */}
            <polyline points="35,68 55,68 45,85" /> {/* Legs bent parallel thighs */}
            <line x1="44" y1="54" x2="70" y2="54" /> {/* Extended guide/arms front */}
            {/* Orange downward gravity arrow */}
            <path d="M 60 25 L 60 45 M 55 40 L 60 45 L 65 40" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        );

      case 3: // MOUNTAIN CLIMBERS
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="80" x2="95" y2="80" stroke="#475569" strokeWidth="1.5" />
            <circle cx="35" cy="42" r="5.5" fill="#0f172a" />
            <line x1="38" y1="44" x2="80" y2="68" /> {/* Straight body alignment */}
            <line x1="80" y1="68" x2="83" y2="80" /> {/* Both legs straight */}
            <line x1="46" y1="48" x2="46" y2="80" strokeWidth="2.5" />
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="80" x2="95" y2="80" stroke="#475569" strokeWidth="1.5" />
            <circle cx="35" cy="42" r="5.5" fill="#0f172a" />
            <line x1="38" y1="44" x2="52" y2="54" /> {/* Spine */}
            <line x1="52" y1="54" x2="80" y2="70" /> {/* One straight Leg back */}
            <line x1="80" y1="70" x2="83" y2="80" />
            <polyline points="52,54 42,66 54,64" stroke="#f59e0b" /> {/* Bent knee driven forward deeply */}
            <line x1="46" y1="48" x2="46" y2="80" />
            {/* Forward horizontal loop arrow */}
            <path d="M 64 54 Q 50 48 44 58" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        );

      case 4: // FENTES ALTERNÉES (Lunges)
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="50" cy="24" r="5.5" fill="#0f172a" />
            <line x1="50" y1="30" x2="50" y2="58" />
            <line x1="50" y1="58" x2="44" y2="85" />
            <line x1="50" y1="58" x2="56" y2="85" />
            <polyline points="50,38 40,38 40,48" />
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="48" cy="34" r="5.5" fill="#0f172a" /> {/* Lowered body */}
            <line x1="48" y1="40" x2="48" y2="62" />
            <polyline points="48,62 32,62 32,85" /> {/* Deep 90° front knee bend */}
            <polyline points="48,62 66,66 64,83" /> {/* Lowered back leg/knee */}
            <polyline points="48,46 38,42 42,52" />
            {/* Forward step motion helper */}
            <path d="M 64 45 Q 74 55 58 65" stroke="#f59e0b" strokeWidth="1.2" strokeDasharray="2,2" />
          </g>
        );

      case 5: // BURPEES
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="85" x2="95" y2="85" stroke="#475569" strokeWidth="1.5" />
            {/* Deep crouch squat preparatory shape */}
            <circle cx="42" cy="54" r="5.5" fill="#0f172a" />
            <line x1="42" y1="60" x2="35" y2="72" />
            <polyline points="35,72 50,72 45,85" />
            <line x1="42" y1="62" x2="38" y2="83" /> {/* Hands touching floor */}
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="85" x2="95" y2="85" stroke="#475569" strokeWidth="1.5" />
            {/* Jump tall extension in mid-air */}
            <circle cx="50" cy="18" r="5.5" fill="#0f172a" />
            <line x1="50" y1="24" x2="50" y2="52" />
            <line x1="50" y1="52" x2="44" y2="78" /> {/* Flying legs */}
            <line x1="50" y1="52" x2="56" y2="78" />
            <line x1="50" y1="30" x2="38" y2="10" /> {/* Hands pointing to sky */}
            <line x1="50" y1="30" x2="62" y2="10" />
            {/* Explosive propulsion energy lines */}
            <line x1="42" y1="82" x2="50" y2="80" stroke="#f97316" strokeWidth="1.5" />
            <line x1="58" y1="82" x2="50" y2="80" stroke="#f97316" strokeWidth="1.5" />
          </g>
        );

      case 6: // DIPS
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Bench / Chair */}
            <rect x="52" y="55" width="28" height="30" fill="#1e293b" stroke="#475569" strokeWidth="1" rx="2" />
            {/* Straight arm support upright posture */}
            <circle cx="40" cy="34" r="5.5" fill="#0f172a" />
            <line x1="40" y1="40" x2="40" y2="60" /> {/* Spine */}
            <polyline points="40,60 28,60 28,85" /> {/* Legs bent forward slightly */}
            <polyline points="40,44 54,44 54,55" strokeWidth="2.5" /> {/* Arms locked */}
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Bench / Chair */}
            <rect x="52" y="55" width="28" height="30" fill="#1e293b" stroke="#475569" strokeWidth="1" rx="2" />
            {/* Lowered body with deeply bent arms */}
            <circle cx="40" cy="48" r="5.5" fill="#0f172a" stroke="#10b981" />
            <line x1="40" y1="54" x2="40" y2="72" />
            <polyline points="40,72 25,68 25,85" />
            <polyline points="40,56 52,50 54,55" /> {/* Deeply flexed elbow */}
            {/* Down vector */}
            <path d="M 12 40 L 12 55 M 8 48 L 12 55 L 16 48" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        );

      case 7: // PLANCHE (Static plank)
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="80" x2="95" y2="80" stroke="#475569" strokeWidth="1.5" />
            {/* Horizontal perfect elbow plank silhouette */}
            <circle cx="28" cy="54" r="5.5" fill="#0f172a" />
            <line x1="33" y1="56" x2="82" y2="56" /> {/* Parallel spine */}
            <line x1="82" y1="56" x2="85" y2="80" /> {/* Feet pointing to ground */}
            <polyline points="38,56 38,72 48,72" /> {/* Supporting elbow arm */}
            <circle cx="60" cy="56" r="3" fill="#38bdf8" opacity="0.4" /> {/* Core focus */}
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="80" x2="95" y2="80" stroke="#475569" strokeWidth="1.5" />
            {/* Peak stability with tension glow */}
            <circle cx="28" cy="54" r="5.5" fill="#0f172a" />
            <line x1="33" y1="56" x2="82" y2="56" />
            <line x1="82" y1="56" x2="85" y2="80" />
            <polyline points="38,56 38,72 48,72" />
            {/* Static tension ring around core */}
            <ellipse cx="55" cy="56" rx="8" ry="12" stroke="#ef4444" strokeWidth="1" strokeDasharray="2,2" />
            <circle cx="55" cy="56" r="4" fill="#f59e0b" opacity="0.8" />
          </g>
        );

      case 8: // RUSSIAN TWIST
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Seated 45 degrees upright */}
            <circle cx="60" cy="38" r="5.5" fill="#0f172a" />
            <line x1="60" y1="44" x2="50" y2="70" /> {/* Tilted torso */}
            <polyline points="50,70 30,58 18,66" /> {/* Raised knees in V */}
            <line x1="60" y1="48" x2="35" y2="48" /> {/* Hands outstretched front */}
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* Seated twisting torso holding weighted core */}
            <circle cx="58" cy="38" r="5.5" fill="#0f172a" />
            <line x1="58" y1="44" x2="50" y2="70" />
            <polyline points="50,70 30,58 18,66" />
            <polyline points="58,48 44,56 36,54" /> {/* Hands rotated to the side */}
            <circle cx="36" cy="54" r="3.5" fill="#10b981" /> {/* Clapsed core */}
            {/* Curved twist dynamic guidelines */}
            <path d="M 40 32 Q 32 40 40 48" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        );

      case 9: // SAUTS GROUPÉS (Tuck jumps)
        return isDepart ? (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            {/* Loading explosive half-squat */}
            <circle cx="50" cy="38" r="5.5" fill="#0f172a" />
            <line x1="50" y1="44" x2="50" y2="64" />
            <polyline points="50,64 36,68 44,85" /> {/* Crouching legs ready */}
            <polyline points="50,64 64,68 56,85" />
            <line x1="50" y1="48" x2="35" y2="58" />
          </g>
        ) : (
          <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,3" />
            {/* Flying knees tucked high closely to chest */}
            <circle cx="50" cy="22" r="5.5" fill="#0f172a" />
            <line x1="50" y1="28" x2="50" y2="52" />
            <polyline points="50,52 38,38 28,42" /> {/* Fully tucked high knee segment */}
            <polyline points="50,52 62,38 72,42" />
            <polyline points="50,34 34,26 44,24" /> {/* Arms slapping knees */}
            {/* Lift propulsion lines */}
            <path d="M 46 80 L 46 64" stroke="#f59e0b" strokeWidth="1.5" />
            <path d="M 54 80 L 54 64" stroke="#f59e0b" strokeWidth="1.5" />
          </g>
        );

      default:
        return (
          <g stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="85" x2="90" y2="85" stroke="#475569" strokeWidth="1.5" />
            <circle cx="50" cy="30" r="6" fill="#0f172a" />
            <line x1="50" y1="36" x2="50" y2="62" />
            <line x1="50" y1="62" x2="44" y2="85" />
            <line x1="50" y1="62" x2="56" y2="85" />
          </g>
        );
    }
  };

  const getExerciseImagePath = (id: number): string | null => {
    if (isWarmup || id === -1) {
      const normName = exerciseName.toLowerCase();
      if (normName.includes("jumping") || normName.includes("jack")) return imgWarmupJacks;
      if (normName.includes("rotation") || normName.includes("bras")) return imgWarmupRotations;
      if (normName.includes("genoux") || normName.includes("mont")) return imgWarmupGenoux;
      if (normName.includes("fesses") || normName.includes("talon")) return imgWarmupTalons;
      if (normName.includes("squat")) return imgWarmupSquatsLegers;
      if (normName.includes("planche") || normName.includes("gainage")) return imgWarmupPlancheActive;
      return null;
    }
    switch (id) {
      case 1: return imgPompes;
      case 2: return imgSquats;
      case 3: return imgClimbers;
      case 4: return imgFentes;
      case 5: return imgBurpees;
      case 6: return imgDips;
      case 7: return imgPlanche;
      case 8: return imgTwist;
      case 9: return imgSauts;
      default: return null;
    }
  };

  const muscle = getMuscleTarget();
  const intensity = getIntensityScore();
  const imagePath = getExerciseImagePath(exerciseId);

  return (
    <div className="relative w-full h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between items-center p-3.5 shadow-inner shadow-black/80 select-none">
      
      {/* Tactical HUD Header status strip */}
      <div className="w-full flex justify-between items-center text-[10px] font-mono text-emerald-500/70 border-b border-slate-800 pb-2 uppercase tracking-widest z-10">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          {imagePath ? "GUIDE VISUEL ILLUSTRÉ" : "SCHÉMAS DE MOUVEMENT STATIQUES"}
        </span>
        <span>ID: MIL-{exerciseId > 0 ? `0${exerciseId}` : 'SPC'} // LIVE</span>
      </div>

      {/* Target Crosshair Grid background (Static, clean tactical vibe) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="staticGrid" width="16" height="16" patternUnits="userSpaceOnUse">
              <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#10b981" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#staticGrid)" />
          {/* Centering crosshairs */}
          <line x1="25%" y1="50%" x2="75%" y2="50%" stroke="#10b981" strokeWidth="0.5" />
          <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#10b981" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Main visualization frame */}
      {imagePath ? (
        <div className="w-full flex-1 flex items-center justify-center relative min-h-[160px] max-h-[220px] z-10 py-1.5">
          <div className="w-full h-full bg-[#fcfbf9] rounded-xl border border-slate-950 p-2.5 flex items-center justify-center overflow-hidden shadow-2xl relative">
            <img 
              src={imagePath} 
              alt={exerciseName} 
              className="max-h-full max-w-full object-contain rounded-md"
              referrerPolicy="no-referrer"
            />
            {/* Overlay grid overlay lines for tactical flavor */}
            <div className="absolute inset-0 border border-emerald-500/10 pointer-events-none rounded-md"></div>
          </div>
        </div>
      ) : (
        /* Side-by-side static figures viewports as fallback / warmups / cooldowns */
        <div className="w-full flex-1 flex gap-3 items-center justify-center relative min-h-[160px] max-h-[220px] z-10 py-1.5">
          
          {/* PANEL A: STARTING POSITION */}
          <div className="flex-1 h-full bg-slate-950/40 rounded-xl border border-slate-800/80 p-1.5 flex flex-col items-center justify-between relative overflow-hidden">
            <span className="absolute top-1.5 left-2 px-1.5 py-0.5 text-[8px] font-mono font-bold text-sky-400 bg-sky-950/80 border border-sky-500/30 rounded uppercase tracking-wider">
              1. REPOS / DÉPART
            </span>
            <div className="w-full flex-1 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full max-w-[125px] max-h-[140px]"
                referrerPolicy="no-referrer"
              >
                {renderExerciseBlueprint('DEPART')}
              </svg>
            </div>
          </div>

          {/* PANEL B: ACTIVE PEAK STATE */}
          <div className="flex-1 h-full bg-slate-950/40 rounded-xl border border-slate-800/80 p-1.5 flex flex-col items-center justify-between relative overflow-hidden">
            <span className="absolute top-1.5 left-2 px-1.5 py-0.5 text-[8px] font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 rounded uppercase tracking-wider">
              2. CONTRACTION / APEX
            </span>
            <div className="w-full flex-1 flex items-center justify-center">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full max-w-[125px] max-h-[140px]"
                referrerPolicy="no-referrer"
              >
                {renderExerciseBlueprint('ACTION')}
              </svg>
            </div>
          </div>

        </div>
      )}

      {/* Sensor / Tactical biomechanics details bar */}
      <div className="w-full bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono flex items-center justify-between z-10 mt-1">
        <div className="flex flex-col">
          <span className="text-slate-500 uppercase text-[9px]">Fibres ciblées principales</span>
          <span className="text-emerald-400 font-bold truncate max-w-[190px]">{muscle}</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-slate-500 uppercase text-[9px]">Intensité cible</span>
          <span className="font-semibold text-amber-500">
            CONTRACTION: {intensity}%
          </span>
        </div>
      </div>
    </div>
  );
};
