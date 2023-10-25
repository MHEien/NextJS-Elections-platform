"use client"
import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Input } from '@/components/ui'
import { Button } from '@/components/ui'
import { User } from '@prisma/client'
import * as XLSX from 'xlsx';


type VoterDetail = {
  user: Partial<User>;
  voterId: string;
};


interface VoterDropzoneProps {
    voters: VoterDetail[];
    setVoters: (voters: VoterDetail[]) => void;
}


export function VoterDropzone({voters, setVoters}: VoterDropzoneProps) {
  const [fileName, setFileName] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    acceptedFiles.forEach((file) => {
      setFileName(file.name);

      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        const binaryStr = reader.result;
        const workbook = XLSX.read(binaryStr, {type: 'array'});
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
        // Validate headers
        if (jsonData.length > 0) {
          const keys = Object.keys(jsonData[0] as object);
          const requiredHeaders = ['email', 'name', 'campus', 'voter_id'];
    
          if (!requiredHeaders.every(header => keys.includes(header))) {
            console.error("Invalid Excel file format");
            return;
          }
        }
    
        // Map jsonData to match VoterDetail format
        const mappedVoters: VoterDetail[] = jsonData.map((data: any) => ({
          user: {
            email: data.email,
            name: data.name,
            campus: data.campus,
            // ... add other properties if User has more fields
          },
          voterId: data.voter_id
        }));
    
        // Set the parsed data
        setVoters(mappedVoters);
    }
    
      reader.readAsArrayBuffer(file);
    });
}, [setVoters]);

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  const removeFile = () => {
    setFileName(null); // Remove the selected file
  }

  return (
    <div>
      <div {...getRootProps()} style={{
    border: '2px dashed gray',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer'
}}>
  {!fileName ? (
    <p>Drag & drop an Excel file here, or click to select one</p>
  ) : (
    <>
      <p>{fileName}</p>
      <Button onClick={removeFile}>Remove file</Button>
    </>
  )}
  <Input {...getInputProps()} />
</div>
    </div>
  )
}