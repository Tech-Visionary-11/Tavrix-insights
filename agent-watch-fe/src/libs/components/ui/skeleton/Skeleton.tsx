
type SkeletonProps = {
  className?: string; // to customize size/shape
  circle?: boolean;   // render as circle
};

export const Skeleton = ({ className = "", circle = false }: SkeletonProps) => {
  return (
    <div
      className={`
        animate-pulse
        bg-gray-200 dark:bg-gray-700
        ${circle ? "rounded-full" : "rounded-md"}
        ${className}
      `}
    />
  );
};
