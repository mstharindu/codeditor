import React, { useEffect, useRef } from 'react';

const iframeHTML = `<html>
	<body>
		<div id="root"></div>
		<script>

      const handleError = (e) => {
          document.body.innerHTML = '<pre style="color: red">'+e+'</pre>'
          console.error(e)
      }

      window.addEventListener('error', (event) => {
        event.preventDefault();
        handleError(event.error)
      })

			window.addEventListener('message', (event) => {

        const {code, error} = event.data

        if(error !== ''){
          handleError(error)
          return
        }

        try{
          eval(code)
        }catch(e){
          handleError(e)
        }			
			})
		</script>
	</body>
</html>`;

interface CodePreviewProps {
  code: string;
  error: string;
}

export const CodePreview: React.FC<CodePreviewProps> = ({ code, error }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const iframe = iframeRef?.current;

    const updatePreview = () => {
      try {
        if (iframe?.contentWindow) {
          iframe.contentWindow.postMessage({ code, error }, '*');
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
  }, [code, error]);

  return (
    <iframe
      title="Preview"
      ref={iframeRef}
      style={{
        height: '100vh',
        width: '50%',
      }}
      sandbox="allow-scripts"
      srcDoc={iframeHTML}
    ></iframe>
  );
};
