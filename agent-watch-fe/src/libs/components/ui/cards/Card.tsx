import { cn } from "../../../utils/cn";

type CardProps = {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export const Card: React.FC<CardProps> = ({
  title,
  description,
  footer,
  actions,
  children,
  className,
}) => (
  <div className={cn(
    "bg-white rounded-2xl p-6 shadow-md ring-1 ring-gray-100",
    className
  )}>
    {(title || description) && (
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
        {actions}
      </div>
    )}

    <div className="space-y-4">{children}</div>

    {footer && (
      <div className="mt-6 pt-4 text-sm text-gray-600 border-t border-gray-100">
        {footer}
      </div>
    )}
  </div>
);
