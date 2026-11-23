'use strict';

const fitPresets = [
  {title:'Байкпакинг по асфальту', values:{surface:'roadpacking', style:'touring', distance:150, tire:40, luggage:12}},
  {title:'Гравий на 100+ км', values:{surface:'gravel', style:'endurance', distance:120, tire:45, luggage:4}},
  {title:'Эндуро-трейл', values:{surface:'rough', style:'enduro', distance:30, tire:61, luggage:0}},
  {title:'Городской комьют', values:{surface:'road', style:'commute', distance:15, tire:35, luggage:3}}
];
const fitGuidance = {
  touring:'Проверьте крепления для багажа и зазор под крылья.',
  endurance:'Проверьте, можете ли подолгу держать руки на манетках и менять хват без напряжения в плечах.',
  enduro:'Для технических спусков сначала рассмотрите MTB с прямым рулём и дроппером. Для прыжков и гонок проверяйте категорию использования рамы.',
  commute:'Для ежедневных поездок проверьте крепления для крыльев и багажника.'
};
