import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  imports: [],
  template: `
    <div
      class="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm animate-pulse"
    >
      <div class="h-48 bg-gray-300 dark:bg-gray-700"></div>

      <div class="p-6 space-y-4">
        <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>

        <div class="space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
        </div>

        <div class="flex gap-2 pt-2">
          <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-16"></div>
          <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded-full w-16"></div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkeletonUI {}
