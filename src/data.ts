import { Workout } from './types';

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'chest-back-power',
    title: 'Trening Siłowy: Klatka i Plecy',
    description: 'Championship-grade chest and back session aiming at structural balance, mechanical tension, and explosive power.',
    duration: 45,
    level: 'ZAAWANSOWANY',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCB4wrLTeHHllpeeHax7ooHDj6g1YGUI9L036Gdk7323aC70-ATg19c5xqw28eu22oR9Y0gBwRBloGT4neyxthB4qVhjj_pjOgeRKkjXuj-T8UdVLhWm10JCC4dLADkaB2S7MbzAo9M-q0FS9QGODhLGEQ-6M5PCVJSPqFQjVN7o07T26khDYKXVQ-UztE0tWXpb5sJjEIsHAC4kYEDA0JyPvLJgNa4kWjFUBKctfsLmKi4NCWaHwhmPX45RzSmE2bOj-eMBs5q6JsH',
    category: 'Siła',
    exercises: [
      { id: 'cb1', name: 'Wyciskanie sztangi poziomo (Bench Press)', sets: 4, reps: '8' },
      { id: 'cb2', name: 'Podciąganie nachwytem (Pull Ups)', sets: 4, reps: '8-10' },
      { id: 'cb3', name: 'Wyciskanie hantli na skosie (Incline Press)', sets: 3, reps: '10' },
      { id: 'cb4', name: 'Wiosłowanie sztangą (Barbell Row)', sets: 4, reps: '10' },
      { id: 'cb5', name: 'Rozpiętki na bramie (Cable Flys)', sets: 3, reps: '12' },
      { id: 'cb6', name: 'Ściąganie drążka wyciągu (Lat Pulldown)', sets: 3, reps: '12' }
    ]
  },
  {
    id: 'strength-master',
    title: 'Mistrz Siły',
    description: 'Buduj potężną bazę siłową i gęstość mięśniową dzięki wielostawowym bojom o najwyższej stymulacji układu nerwowego.',
    duration: 60,
    level: 'ZAAWANSOWANY',
    weeks: '6 TYGODNI',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8qT5W8_DnHNihG-rgPnoL_OTD1uTaOknOD8elNQmSuksMhgM_5MWPMGFNpMT64oXzy4hWlhGSL5ErQYuArmwhCtV2ZXbDbAvEab6lQDfnVqDMoFCu3JgTPIzoLCPPqF8ldaFBtXI0au6IMe8iUlHldZLKm3Pel92Mdtr4Ru_lldWC45_DVbtgaJiEYuf0QZ8OVWArsKK5YVxlO4EWSV-q5Y1mnU8VTO0KRS4T8gtxY7gr-A-bxm2eqmnYJWYIXwfveikShPwGPnI_',
    category: 'Siła',
    exercises: [
      { id: 'sm1', name: 'Przysiady ze sztangą na plecach (Back Squat)', sets: 5, reps: '5' },
      { id: 'sm2', name: 'Wyciskanie żołnierskie (Military Press)', sets: 4, reps: '6' },
      { id: 'sm3', name: 'Martwy ciąg klasyczny (Deadlift)', sets: 4, reps: '5' },
      { id: 'sm4', name: 'Pompki na poręczach z ciężarem (Heavy Dips)', sets: 3, reps: '8' }
    ]
  },
  {
    id: 'hiit-burn',
    title: 'Spalanie HIIT',
    description: 'Maksymalna wydajność tlenowa, przyspieszony metabolizm i błyskawiczna redukcja tkanki tłuszczowej dzięki interwałom.',
    duration: 30,
    level: 'ŚREDNI',
    weeks: '4 TYGODNIE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDDnkQ1c71dsLO1AJXcdr0_uUV2bzd-F7Z_0oet2Mftrq3LWXA-wOG-rxcKq1mXlzrWINFHuxzl5uH3gTyGQZY9nqKdosBtA5yoEwfzrrC2jFbH-_Tm0b9q7m4ypXEFzvWX2JgAQo-yE-W5ne-ZY9-18ECt5uTtCDVeBuAR1uc8jEUxAeH-7ig_coNfLgDMvrBLs_gPI1IEyv4o6sSdc-Xkd7nwLAH9n7Dq0K7jX8gcF-Aa1uAAbb3CrP1fOppACAc7IaG5kqgep86M',
    category: 'Cond',
    exercises: [
      { id: 'hi1', name: 'Burpees (Krokodylki)', sets: 3, reps: '45 sek', durationSec: 45 },
      { id: 'hi2', name: 'Mountain Climbers (Wspinaczka)', sets: 3, reps: '40 sek', durationSec: 40 },
      { id: 'hi3', name: 'Wysoki wyskok z przysiadu (Jump Squat)', sets: 3, reps: '30 sek', durationSec: 30 },
      { id: 'hi4', name: 'Wachlowanie kettlebellem (Kettlebell Swings)', sets: 3, reps: '45 sek', durationSec: 45 }
    ]
  },
  {
    id: 'mobility-pro',
    title: 'Mobilność PRO',
    description: 'Zwiększ zakres ruchu, uwolnij zablokowane stawy, zredukuj ból i przyspiesz powysiłkową regenerację powięziową.',
    duration: 25,
    level: 'POCZĄTKUJĄCY',
    weeks: '3 TYGODNIE',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAnVXSAKDat9eFJtmv2y01zAPN2zR5dupzk1Ryh8exq5s8hiW65NC6xyNHXJQiz7UtpKuFij9sr8LP16qhzIgIeusE2EiesNK0NJQO4S-5p80uHlDSWsnEGhe5UVb29GCQSJ0yhJ4NqVJdVLgxRBxIOkh6XU0rP8WPjssrj5WlViKQJPPflf5nyLL_-sv43upzyp_jVyuxYytEgRiZR5nxig6qQ-kL9JDAOCAsNAazuIusSnc3iu7hW66gZvurOr08TdWqUa7-5bHL4',
    category: 'Regen',
    exercises: [
      { id: 'mb1', name: 'Rozciąganie kanapowe uda (Couch Stretch)', sets: 2, reps: '60 sek na nogę', durationSec: 60 },
      { id: 'mb2', name: 'Głęboki przysiad z rotacją tułowia', sets: 3, reps: '10 reps' },
      { id: 'mb3', name: 'Pies z głową w dół (Downward Dog Hold)', sets: 3, reps: '45 sek', durationSec: 45 },
      { id: 'mb4', name: 'Koci grzbiet (Cat-Cow spine wave)', sets: 3, reps: '60 sek', durationSec: 60 }
    ]
  }
];
