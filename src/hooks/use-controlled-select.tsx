import { type Control, Controller, useWatch } from 'react-hook-form'
import { useMemo } from 'react'
import { Label } from '@/components/lib'
// @ts-ignore Not sure why it works like this
import Select, { type OptionsTypeBase } from 'react-select'

type UseControlledSelect = {
    name: string
    labelText: string
    options: OptionsTypeBase[]
    control: Control
    defaultValue?: OptionsTypeBase
    placeholder?: string
}

export function useControlledSelect({
    name,
    labelText,
    options,
    control,
    defaultValue,
    placeholder,
}: UseControlledSelect) {
    const selectedInputType = useWatch({ name, control })
    const selectedInputOption = options.find(e => selectedInputType === e.value)

    const controlledSelect = useMemo(
        () => (
            <div className="space-y-2">
                <Label htmlFor={name}>{labelText}</Label>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <Select
                            id={name}
                            options={options}
                            defaultValue={defaultValue}
                            isSearchable={false}
                            className="mt-2 min-w-0 rounded-none rounded-r-sm border-gray-300 focus:border-neutral-500 focus:ring-neutral-500 sm:text-sm"
                            onChange={option => field.onChange(option.value)}
                            value={selectedInputOption}
                            placeholder={placeholder}
                            onBlur={field.onBlur}
                            name={field.name}
                        />
                    )}
                />
            </div>
        ),
        [name, labelText, control, options, selectedInputOption, defaultValue, placeholder]
    )

    return controlledSelect
}
