import React, { useState, useRef, useEffect } from 'react';

interface BoxProps {
  isVisible: boolean;
  onClose: () => void;
  num : number;
}

const BoxComponent: React.FC<BoxProps> = ({ isVisible, onClose, num }) => {
  return isVisible ? (
    <div className="box">
      {/* Your box content */}
      <p>Box Content {num}</p>
      <button onClick={onClose}>Close Box</button>
    </div>
  ) : null;
};

const ButtonsComponent: React.FC = () => {
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const [boxVisibility, setBoxVisibility] = useState<{ [key: number]: boolean }>({});

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleButtonClick = (buttonIndex: number) => {
    setActiveButton(buttonIndex);
    setBoxVisibility((prevVisibility) => ({
      ...Object.fromEntries(Object.keys(prevVisibility).map((key) => [key, false])),
      [buttonIndex]: true,
    }));
  };

  const handleBoxClose = () => {
    setActiveButton(null);
    setBoxVisibility({});
  };

  const handleOutsideClick = (event: MouseEvent) => {
    // Check if the click is outside the buttons and boxes
    console.log("clicked");
    if (
      !buttonRefs.current.some((buttonRef) => buttonRef && buttonRef.contains(event.target as Node)) &&
      !Object.values(boxVisibility).some((isVisible) => isVisible)
    ) {
      handleBoxClose();
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [boxVisibility]);

  return (
    <div>
      <button ref={(ref) => (buttonRefs.current[0] = ref)} onClick={() => handleButtonClick(0)}>
        Button 1
      </button>
      <button ref={(ref) => (buttonRefs.current[1] = ref)} onClick={() => handleButtonClick(1)}>
        Button 2
      </button>
      <button ref={(ref) => (buttonRefs.current[2] = ref)} onClick={() => handleButtonClick(2)}>
        Button 3
      </button>
      <button ref={(ref) => (buttonRefs.current[3] = ref)} onClick={() => handleButtonClick(3)}>
        Button 4
      </button>

      {buttonRefs.current.map((buttonRef, index) => (
        <BoxComponent key={index} isVisible={boxVisibility[index]} num={index} onClose={handleBoxClose} />
      ))}
    </div>
  );
};

export default ButtonsComponent;
