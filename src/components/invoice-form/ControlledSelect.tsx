// @ts-ignore - Doesn't find OptionsTypeBase declaration but still required to work
import Select, { type OptionsTypeBase } from 'react-select'
import { type Control, Controller, useWatch } from 'react-hook-form'
import { Label } from '..'

type ControlledSelectProps = {
    name: string
    labelText: string
    options: OptionsTypeBase[]
    control: Control
    defaultValue?: OptionsTypeBase
    placeholder?: string
}

export const ControlledSelect: React.FC<ControlledSelectProps> = ({
    name,
    labelText,
    options,
    control,
    defaultValue,
    placeholder,
}) => {
    const selectedInputValue = useWatch({ name, control })
    const selectedInputOption = options.find(e => selectedInputValue === e.value)

    return (
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
    )
}
