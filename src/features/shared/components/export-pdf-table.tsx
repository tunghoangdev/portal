import { Document, Font, Image, Page, Text, View } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto/Roboto-Light.ttf",
  fontWeight: 300,
  fontStyle: "normal",
});
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto/Roboto-Regular.ttf",
  fontWeight: 400,
  fontStyle: "normal",
});
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto/Roboto-Medium.ttf",
  fontWeight: 500,
  fontStyle: "normal",
});
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto/Roboto-SemiBold.ttf",
  fontWeight: 600,
  fontStyle: "normal",
});
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto/Roboto-Bold.ttf",
  fontWeight: 700,
  fontStyle: "normal",
});
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto/Roboto-ExtraBold.ttf",
  fontWeight: 800,
  fontStyle: "normal",
});
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto/Roboto-Black.ttf",
  fontWeight: 900,
  fontStyle: "normal",
});

const tw = createTw(
  {
    theme: {
      fontFamily: {
        sans: ["Roboto"],
      },
      extend: {
        colors: {
          custom: "#bada55",
        },
      },
    },
  },
  {
    ptPerRem: 12,
  }
);
interface Props {
  children?: React.ReactNode;
  title?: string;
}
export const ExportPdfTable = ({ children, title }: Props) => {
  return (
    <Document>
      <Page size="A4" style={tw("flex flex-col bg-white font-sans")}>
        <View style={tw("flex-grow m-2.5 mb-0 p-2.5")}>
          <Image
            src={"/images/slogan.png"}
            style={tw(
              "w-auto max-w-[150px] h-[120px] object-contain mb-2.5 absolute top-0 left-0"
            )}
          />
          {/* <View style={tw('flex-grow m-2.5 p-2.5 flex flex-row items-center')}> */}
          {/* <Image
						src={'/images/logo.png'}
						style={tw('w-[40px] h-[40px] object-contain mb-2.5')}
					/> */}
          {title && (
            <Text
              style={tw(
                "text-2xl leading-none font-semibold mt-[40px] text-center uppercase"
              )}
            >
              {title}
            </Text>
          )}
        </View>
        <View style={tw("flex-grow mx-2.5 p-2.5 pt-0")}>{children}</View>
        <View
          style={tw(
            "flex-grow flex flex-col mt-10 justify-end gap-y-2.5 text-default-600 border-t border-gray-200 pt-5"
          )}
        >
          <Text
            style={tw(
              "text-xl leading-none font-medium text-center uppercase text-default-600"
            )}
          >
            CÔNG TY TNHH DU HỌC VÀ VIỆC LÀM EXWORK
          </Text>
          <Text
            style={tw(
              "text-sm font-light leading-none text-center text-default-600"
            )}
          >
            Hotline: 02583.888.879 - 0947.888.939
          </Text>
          <Text
            style={tw(
              "text-sm font-light leading-none text-center text-default-600"
            )}
          >
            365 Đường 23/10, phường Tây Nha Trang, Tỉnh Khánh Hòa, Việt Nam.
          </Text>
        </View>
      </Page>
    </Document>
  );
};
