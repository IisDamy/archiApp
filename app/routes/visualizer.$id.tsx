import Button from 'components/ui/Button';
import { generate3DView } from 'lib/ai.action';
import { Box, Download, Share2, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'


function VisualizerId() {
  const navigate = useNavigate()
  const location = useLocation()
  const {initialImage, initialRender, name} = location.state || {};

  const hasInitialGenerated = useRef(false)

  const [isProcessing, setIsProcessing] = useState(false)
  const [currentImage, setCurrentImage] = useState<string | null>(initialRender || null )

  const handleBack = () => navigate('/')

  const runGeneration = async () => {
    if(!initialImage) return;

    try{
      setIsProcessing(true)
      const result = await generate3DView({sourceImage:initialImage});

      if (result.renderedImage) {
        setCurrentImage(result.renderedImage);

        //
      }
    }
    catch(er){
      console.error(er)
    }
  }

  useEffect(()=> {
    if(!initialImage && hasInitialGenerated.current) return;
      
    if (initialRender) {
      setCurrentImage(initialRender);
     return;
    }
     hasInitialGenerated.current = true;
    runGeneration()
    },[initialImage, initialRender])

  return (
    <div className='visualizer'>
      <nav className='topbar'>
        <div className='brand'>
          <Box className='logo'/>
          <span className='name'>Roomify</span>
        </div>
        <Button variant='ghost' size='sm' onClick={handleBack}
        className='exit'>
          <X className='icon' /> Exit Editor
        </Button>
      </nav>

      <section className='content'>
        <div className='panel'>
          <div className='panel-header'>
            <div className='panel-meta'>
              <p>Project</p>
              <h2>{'untitled project'}</h2>
              <p className='note'>Created by you</p>
            </div>

            <div className='panel-actions'>
              <Button
              size='sm'
              onClick={()=>{}}
              className='export'
              disabled={!currentImage}
              >
                <Download className='w-4 h-4 mr-2'/> Export
              </Button>

              <Button size='sm' onClick={()=>{}} className='share'>
                <Share2 className='w-4 h-4 mr-2'/>
              </Button>
            </div>
          </div>

          <div className={`render-area ${isProcessing? 'is-processing':''}`}>
            {
              currentImage? (<img src={currentImage} alt='AI Render' className='render-ing'/>):
              (
                <div className='render-placeholder'>
                  {initialImage && (<img src={initialImage} alt='Original' className='render-fallback'/>)}
                </div>
              )
            }
          </div>

        </div>
      </section>
    </div>
  )
}

export default VisualizerId