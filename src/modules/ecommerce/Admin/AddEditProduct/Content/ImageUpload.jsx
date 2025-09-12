import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import AppGrid from '@crema/components/AppGrid';
import { Box } from '@mui/material';
import { Fonts } from '@crema/constants/AppEnums';
import PropTypes from 'prop-types';
import {
  PreviewThumb,
  UploadModern,
} from '../../../../thirdParty/reactDropzone/components';

const ImgUpload = ({ uploadedFiles, setUploadedFiles }) => {
  console.log("uploadPath",uploadedFiles);
  
  const dropzone = useDropzone({
    accept: {
      'image/png': ['.png', '.jpeg', '.jpg'],
    },
    onDrop: (acceptedFiles) => {
      setUploadedFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  useEffect(() => {
    setUploadedFiles(dropzone.acceptedFiles);
  }, [dropzone.acceptedFiles]);

  const onDeleteUploadFile = (file) => {
    dropzone.acceptedFiles.splice(dropzone.acceptedFiles.indexOf(file), 1);
    setUploadedFiles([...dropzone.acceptedFiles]);
  };

  return (
    <section className="container" style={{ cursor: 'pointer', }}>
      <UploadModern
        setUploadedFiles={setUploadedFiles}
        dropzone={dropzone}
        customContent={
          <>
          
            <img
              src={'/assets/icon/upload.svg'}
              width={100}
              height={100}
              alt="upload"
            />

            <p>
              <Box
                component="span"
                sx={{ color: 'primary.main', fontWeight: Fonts.MEDIUM , }}
              >
                Click to upload
              </Box>{' '}
              or drag and drop
            </p>
            <Box component="p" sx={{ mt: 1 }}>
              SVG, PNG, JPG or GIF (max. 800x400px)
            </Box>
          </>
        }
      />

      {/* Image Preview Grid */}
      <AppGrid
        sx={{
          maxWidth: 600, // Increase width to allow larger previews
          mt: 3,
        }}
        data={uploadedFiles}
        column={3} // 3 columns for larger images
        itemPadding={8} // Increase spacing
        renderRow={(file, index) => (
          <PreviewThumb
            file={file}
            onDeleteUploadFile={onDeleteUploadFile}
            key={index + file.path}
            sx={{
              width: 850, // Increased width
              height: 950, // Increased height
              borderRadius: 70, // Optional rounded corners
              boxShadow: 2, // Add slight shadow
            }}
          />
        )}
      />
    </section>
  );
};

export default ImgUpload;

ImgUpload.propTypes = {
  uploadedFiles: PropTypes.array,
  setUploadedFiles: PropTypes.func,
};
