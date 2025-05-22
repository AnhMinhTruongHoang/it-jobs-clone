import { Carousel, Input, Button, message } from "antd";
import { useState, useRef } from "react";
import enceImg from "@/assets/images/banners/ENCE.jpg";
import fazeImg from "@/assets/images/banners/FAZE.png";
import fgoImg from "@/assets/images/banners/fgo2-1747579745346.png";
import { callUpdateBanner } from "@/config/api";
import "../../styles/BannersPage.module.scss"; 

const BannersPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<string[]>([enceImg, fazeImg, fgoImg]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleImageClick = (index: number) => {
    setSelectedIndex(index);
    inputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedIndex !== null) {
      const reader = new FileReader();
      reader.onload = () => {
        const newImages = [...images];
        newImages[selectedIndex] = reader.result as string;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // Tùy vào cấu trúc API backend bạn có thể gửi như sau:
      const bannersPayload = images.map((img) => ({
        imageUrl: img,
      }));

      // Gửi API gọi update banner list
      await Promise.all(
        bannersPayload.map((banner) => callUpdateBanner(banner))
      );

      message.success("Lưu banner thành công!");
    } catch (error) {
      console.error(error);
      message.error("Lỗi khi lưu banner.");
    } finally {
      setIsSaving(false);
    }
  };

  const onChange = (currentSlide: number) => {
    console.log("Current slide:", currentSlide);
  };

  return (
    <div className="banner-container">
      <Carousel afterChange={onChange} autoplay className="banner-carousel">
        {images.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`banners-${index}`}
              className="banner-image"
              onClick={() => handleImageClick(index)}
            />
          </div>
        ))}
      </Carousel>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div className="banner-actions">
        <Button
          type="primary"
          loading={isSaving}
          onClick={handleSave}
          disabled={images.length === 0}
        >
          Lưu banner
        </Button>
      </div>
    </div>
  );
};

export default BannersPage;
