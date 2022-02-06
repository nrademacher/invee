import * as DialogPrimitive from '@radix-ui/react-dialog'

type DialogContentProps = { children: React.ReactNode } & React.ComponentProps<typeof DialogPrimitive['Content']>

export const DialogContent: React.FC<DialogContentProps> = ({ children, ...props }) => (
    <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 top-0 left-0 right-0 bottom-0 grid place-items-center overflow-y-auto bg-neutral-900 bg-opacity-75 transition-opacity">
            <DialogPrimitive.Content {...props} className="w-full bg-white lg:max-w-screen-lg lg:align-middle">
                {children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
    </DialogPrimitive.Portal>
)
DialogContent.displayName = 'DialogContent'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close
