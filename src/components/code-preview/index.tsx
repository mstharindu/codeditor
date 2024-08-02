import React, { useEffect, useRef } from 'react';

const iframeHTML = `<html>
	<body>
		<div id="root"></div>
		<script>
			window.addEventListener('message', (event) => {
        try{
          eval(event.data)
        }catch(e){
          document.body.innerHTML = '<pre style="color: red">'+e+'</pre>'
          console.error(e)
        }			
			})
		</script>
	</body>
</html>`;

interface CodePreviewProps {
  code: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef?.current;

    const updatePreview = () => {
      try {
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage(code, '*');
        }
      } catch (e) {
        console.error(e);
      }
    };

    if (iframe) {
      iframe.srcdoc = iframeHTML;
      iframe.addEventListener('load', updatePreview);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', updatePreview);
      }
    };
  }, [code]);

  return (
    <iframe
      title="Preview"
      ref={iframeRef}
      style={{
        backgroundColor: 'rgba(0,0,0,0.1)',
        height: '100vh',
        width: '50%',
      }}
      sandbox="allow-scripts"
      srcDoc={iframeHTML}
    ></iframe>
  );
};
