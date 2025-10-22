import React, { useMemo } from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';

interface DateRangePickerProps {
    startDate: Date | null;
    endDate: Date | null;
    onChange: (range: { startDate: Date | null; endDate: Date | null }) => void;
}

const toInputFormat = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const getPresetDates = (preset: 'Last 7 Days' | 'Last 30 Days' | 'This Month' | 'Last Month'): { startDate: Date; endDate: Date } => {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    
    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);

    switch (preset) {
        case 'Last 7 Days':
            startDate.setDate(startDate.getDate() - 6);
            break;
        case 'Last 30 Days':
            startDate.setDate(startDate.getDate() - 29);
            break;
        case 'This Month':
            startDate.setDate(1);
            break;
        case 'Last Month': {
            const today = new Date();
            const lastMonthStartDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            lastMonthStartDate.setHours(0, 0, 0, 0);
            const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
            endOfLastMonth.setHours(23, 59, 59, 999);
            return { startDate: lastMonthStartDate, endDate: endOfLastMonth };
        }
    }
    return { startDate, endDate };
};

const presets = ['Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month'] as const;

const DateRangePicker: React.FC<DateRangePickerProps> = ({ startDate, endDate, onChange }) => {
    
    const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            onChange({ startDate: null, endDate });
            return;
        }
        const [year, month, day] = e.target.value.split('-').map(Number);
        const newStartDate = new Date(year, month - 1, day);
        newStartDate.setHours(0, 0, 0, 0);
        onChange({ startDate: newStartDate, endDate });
    };

    const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.value) {
            onChange({ startDate, endDate: null });
            return;
        }
        const [year, month, day] = e.target.value.split('-').map(Number);
        const newEndDate = new Date(year, month - 1, day);
        newEndDate.setHours(23, 59, 59, 999);
        onChange({ startDate, endDate: newEndDate });
    };
    
    const handlePresetClick = (preset: typeof presets[number]) => {
        const { startDate, endDate } = getPresetDates(preset);
        onChange({ startDate, endDate });
    };
    
    const activePreset = useMemo(() => {
        if (!startDate || !endDate) return null;

        for (const preset of presets) {
            const { startDate: presetStart, endDate: presetEnd } = getPresetDates(preset);
            if (
                toInputFormat(startDate) === toInputFormat(presetStart) &&
                toInputFormat(endDate) === toInputFormat(presetEnd)
            ) {
                return preset;
            }
        }
        return null;
    }, [startDate, endDate]);


    const handleClear = () => {
        onChange({ startDate: null, endDate: null });
    };

    const hasDates = startDate || endDate;

    return (
        <div className="flex flex-col items-start sm:items-center gap-3">
            <div className="flex flex-wrap items-center gap-2">
                {presets.map((preset) => (
                    <button
                        key={preset}
                        type="button"
                        onClick={() => handlePresetClick(preset)}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                            activePreset === preset
                                ? 'bg-primary-600 text-white shadow'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                        }`}
                    >
                        {preset}
                    </button>
                ))}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
                <div className="relative">
                    <input
                        type="date"
                        value={toInputFormat(startDate)}
                        onChange={handleStartDateChange}
                        aria-label="Start date"
                        className="w-full sm:w-auto pl-3 pr-4 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <span className="text-gray-500 dark:text-gray-400">-</span>
                <div className="relative">
                     <input
                        type="date"
                        value={toInputFormat(endDate)}
                        onChange={handleEndDateChange}
                        min={toInputFormat(startDate)}
                        aria-label="End date"
                        className="w-full sm:w-auto pl-3 pr-4 py-2 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                 {hasDates && (
                    <button type="button" onClick={handleClear} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" title="Clear date range">
                        <XCircleIcon className="h-5 w-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default DateRangePicker;
