import React, {useCallback} from 'react'

import {useDropzone} from 'react-dropzone'
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

import './_dropzone.scss';

const Dropzone = (props) => {
    const onDrop = useCallback(acceptedFiles => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => console.log('file reading has failed')
            reader.onload = async () => {
                // upload to server
                const binaryStr = reader.result;
                const response = await fetch('/post-img', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({file: binaryStr, fn:file.name})
                })
                const data = await response.json();
                if (data.err) console.log(data.err);
                if (data.link) console.log(data.link);
            }
            reader.readAsDataURL(file);
        })
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()} className='dropzone'>
            <input {...getInputProps()} />
            {
                isDragActive ?
                <p>Drop the files here ...</p> :
                <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    )
}

export default Dropzone;