export function Section({
  children,
  className = "",
  title,
  subtitle,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-14 sm:py-20 ${className}`}>
      <div className="container-page">
        {title && (
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="section-title">{title}</h2>
            {subtitle && (
              <p className="mt-3 text-sm text-muted sm:text-base">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
