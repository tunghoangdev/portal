import "react-quill-new/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { useMemo, useRef } from "react";

// Tối ưu hóa dynamic import: Chỉ cần import và return component gốc
const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false } // Disable server-side rendering
);

// Cần định nghĩa các props mà bạn muốn sử dụng
interface RHFQuillProps {
  name: Path<FieldValues>;
  control: Control<FieldValues>;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
}

export const EditorField = ({
  name,
  control,
  label,
  placeholder,
  isRequired,
}: RHFQuillProps) => {
  // const reactQuillRef = useRef<any>(null);

  const displayLabel = useMemo(
    () => (
      <>
        {label}
        {isRequired && label && <span className={"text-danger ml-1"}>*</span>}
      </>
    ),
    [label, isRequired]
  );

  // Tối ưu hóa modules và formats bằng useMemo
  const modules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline", "strike", "blockquote"],
        // [{ size: ["small", false, "large", "huge"] }], // custom dropdown
        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ font: [] }],
        [{ align: [] }],
        [
          { list: "ordered" },
          { list: "bullet" },
          { indent: "-1" },
          { indent: "+1" },
        ],
        ["link", "image"],

        ["clean"],
      ],
    }),
    []
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      // "bullet",
      "link",
      "image",
    ],
    [modules.toolbar]
  );

  return (
    <div className="quill-container">
      {displayLabel}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <>
            <ReactQuill
              {...field}
              // @ts-ignore
              // ref={reactQuillRef}
              theme="snow"
              placeholder={placeholder}
              modules={modules}
              formats={formats}
              className="w-full [&_.ql-editor]:min-h-[200px]"
            />
            {fieldState.error && (
              <p className="text-danger text-sm mt-1">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};
