import DescriptionIcon from '@mui/icons-material/Description'
import {
  FormLabel,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material'
import { WidgetProps } from '@rjsf/core'
import { dataURItoBlob } from '@rjsf/core/lib/utils'
import {
  ChangeEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { BytesParameterContext } from './CommandViewForm'

interface FileMetaData {
  dataUrl: string
  parameterName: string | undefined
  name: string
  size: number
  type: string
}

interface FilesMetaDataProps {
  filesMetaData?: FileMetaData[]
}

const dataURIToBlob = dataURItoBlob as (s: string) => {
  blob: Blob
  name: string
}

const processFile = (file: File): Promise<FileMetaData> => {
  const { name, size, type } = file

  return new Promise((resolve, reject) => {
    const reader = new window.FileReader()

    reader.onerror = reject
    reader.onload = (event) => {
      const result = event.target?.result

      if (result) {
        resolve({
          dataUrl: (result as string).replace(
            ';base64',
            `;name=${encodeURIComponent(name)};base64`,
          ),
          parameterName: undefined,
          name,
          size,
          type,
        } as FileMetaData)
      }
    }
    reader.readAsDataURL(file)
  })
}

const processFiles = (files: FileList): Promise<FileMetaData[]> => {
  const promises = Array.prototype.map.call(
    files,
    processFile,
  ) as Promise<FileMetaData>[]
  return Promise.all(promises)
}

const FilesData = ({ filesMetaData }: FilesMetaDataProps) => {
  if (!filesMetaData || filesMetaData.length === 0) {
    return null
  }

  return (
    <List id="file-meta-data">
      {filesMetaData.map((fileMetaData, key) => {
        const { name, size, type } = fileMetaData

        return (
          <ListItem key={key}>
            <ListItemIcon>
              <DescriptionIcon />
            </ListItemIcon>
            <ListItemText primary={name} secondary={`${type}, ${size} bytes`} />
          </ListItem>
        )
      })}
    </List>
  )
}

const fileMetaDataAreEqual = (a: FileMetaData, b: FileMetaData) => {
  return (
    a.dataUrl === b.dataUrl &&
    a.name === b.name &&
    a.parameterName === b.parameterName &&
    a.size === b.size &&
    a.type === b.type
  )
}

const CustomFileWidget = (props: WidgetProps) => {
  const {
    id,
    schema,
    value,
    required,
    disabled,
    readonly,
    label,
    autofocus,
    onChange,
  } = props

  const parameterName = useMemo(() => schema.title, [schema.title])
  const inputRef = useRef()
  const { setFileMetaData } = useContext(BytesParameterContext)
  const [localFileMetaData, setLocalFileMetaData] = useState<FileMetaData[]>([])

  /**
   * Because there can be more than one of these file picker controls in a form,
   * we need a way to update the parent's file data correctly. This function is
   * used as the callback to setFileMetaData state setter.
   */
  const updateGlobalFileMetaData = useCallback(
    (previousFileData: FileMetaData[]) => {
      if (previousFileData.length === 0) {
        return localFileMetaData
      } else {
        const sameParameterNameIndex = previousFileData.findIndex(
          (element) =>
            element.parameterName === localFileMetaData[0].parameterName,
        )

        if (sameParameterNameIndex === -1) {
          const newFileData = [...previousFileData]
          newFileData.push(localFileMetaData[0])

          return newFileData
        } else {
          if (
            fileMetaDataAreEqual(
              previousFileData[sameParameterNameIndex],
              localFileMetaData[0],
            )
          ) {
            return previousFileData
          } else {
            const newFileData: FileMetaData[] = JSON.parse(
              JSON.stringify(
                previousFileData.filter(
                  (element) =>
                    element.parameterName !==
                    localFileMetaData[0].parameterName,
                ),
              ),
            )
            newFileData.push(localFileMetaData[0])

            return newFileData
          }
        }
      }
    },
    [localFileMetaData],
  )

  useEffect(() => {
    setFileMetaData((prev) => updateGlobalFileMetaData(prev))
  }, [localFileMetaData, setFileMetaData, updateGlobalFileMetaData])

  useEffect(() => {
    const values = Array.isArray(value) ? value : [value]
    const newValues = values
      .filter((x) => typeof x !== 'undefined')
      .map((value) => {
        const { name, blob } = dataURIToBlob(value)

        return {
          dataUrl: value,
          parameterName,
          name: name,
          size: blob.size,
          type: blob.type,
        }
      })

    setLocalFileMetaData(newValues)
  }, [parameterName, value])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      processFiles(event.target.files).then((data) => {
        const filesMetaData = data as FileMetaData[]
        const filesDataUrls = filesMetaData.map((x) => x.dataUrl)

        onChange(filesDataUrls[0])
      })
    }
  }

  return (
    <>
      <FormLabel required={required} htmlFor={id}>
        {label || parameterName}
      </FormLabel>
      <Input
        ref={inputRef.current}
        id={id}
        type="file"
        disabled={readonly || disabled}
        onChange={handleChange}
        autoFocus={autofocus}
      />
      <FilesData filesMetaData={localFileMetaData} />
    </>
  )
}

export { type FileMetaData, CustomFileWidget }
