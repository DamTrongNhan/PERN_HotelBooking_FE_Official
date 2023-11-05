import { useState } from 'react';

import { Add } from '@mui/icons-material';

import { Upload, Modal } from 'antd';

const UploadMultiple = props => {
    const { fileList, setFileList } = props;

    const [previewOpen, setPreviewOpen] = useState(false);

    const [previewImage, setPreviewImage] = useState('');

    const handleCancel = () => {
        setPreviewOpen(false);
    };

    const handlePreview = file => {
        setPreviewImage(file.thumbUrl);
        setPreviewOpen(true);
    };

    const handleUpload = ({ fileList }) => {
        setFileList(fileList);
    };

    const uploadButton = (
        <div>
            <Add />
            <div className="ant-upload-text">Upload</div>
        </div>
    );

    return (
        <>
            <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleUpload}
                beforeUpload={() => false}
            >
                {uploadButton}
            </Upload>

            <Modal open={previewOpen} footer={null} onCancel={handleCancel}>
                <img alt="photos" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
};

export default UploadMultiple;
