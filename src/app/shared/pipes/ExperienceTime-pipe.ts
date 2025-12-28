import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appExperienceTime',
  standalone: true,
  pure: true,
})
export class ExperienceTimePipe implements PipeTransform {
  transform(startDate: string, endDate: string = 'Presente'): string {
    const start = new Date(startDate);
    const end = endDate === 'Presente' ? new Date() : new Date(endDate);

    if (isNaN(start.getTime())) return startDate; // Fallback si no es fecha

    let months = (end.getFullYear() - start.getFullYear()) * 12;
    months -= start.getMonth();
    months += end.getMonth();

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    const yearText = years > 0 ? `${years} ${years === 1 ? 'año' : 'años'}` : '';
    const monthText =
      remainingMonths > 0 ? `${remainingMonths} ${remainingMonths === 1 ? 'mes' : 'meses'}` : '';

    return [yearText, monthText].filter((t) => t !== '').join(' y ');
  }
}
