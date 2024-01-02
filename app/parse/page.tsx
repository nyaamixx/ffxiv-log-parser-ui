"use client";

import axios from "axios";
import { useState } from 'react'
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DataGrid, GridRowsProp, GridColDef, GridToolbar } from '@mui/x-data-grid';


const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const columns: GridColDef[] = [
  { field: 'datetime', headerName: 'Time', type: 'dateTime', width: 200, valueGetter: ({ value }) => value && new Date(value), },
  { field: 'sender', headerName: 'Sender', width: 200 },
  { field: 'message', headerName: 'Message', flex: 1 },
];

export default function Home() {
  const [data, setData] = useState<GridRowsProp>([])
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target!=null) {
      const targetFiles = (e.target as HTMLInputElement).files
      const formData = new FormData();
      Array.from(targetFiles?targetFiles:[]).forEach(file => {
        formData.append('file_list', file);
      })
      await axios.post('http://192.168.0.13:8000/parse', formData, {headers:{
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data'
      }}).then(response => {
        console.log(response)
        setData(response.data)
      })
    }
  }
  return (
    <div>
      <h2>FFXIVログパーサー</h2>
      <Box sx={{ my: 4 }}>
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload files
          <VisuallyHiddenInput type="file" multiple onChange={handleFileChange}/>
        </Button>
      </Box>
      {
        data.length ? 
        <div style={{ height: 300, width: '100%' }}>
          <DataGrid rows={data} columns={columns} autoHeight rowHeight={25} slots={{ toolbar: GridToolbar }} />
        </div> : 
        <></>
      }
    </div>
  );
}