import React, { useEffect, useState } from 'react';

interface SvgIconProps {
  url: string;
  primaryColor: string;
  className?: string;
}

export const SvgIcon: React.FC<SvgIconProps> = ({ url, primaryColor, className }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch SVG');
        return res.text();
      })
      .then(text => {
        // Dynamically replace the gold colors in the SVG with the theme's primary color
        let coloredSvg = text
          .replace(/#D4AF37/gi, primaryColor)
          .replace(/#EAA923/gi, primaryColor)
          .replace(/#CDA054/gi, primaryColor);
        setSvgContent(coloredSvg);
      })
      .catch(err => {
        console.error('Error loading SVG icon:', err);
      });
  }, [url, primaryColor]);

  if (!svgContent) {
    return <div className={className} />;
  }

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
};

export default SvgIcon;
