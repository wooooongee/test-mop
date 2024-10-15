import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { throttle } from "lodash"; // lodash에서 throttle 사용

const DraggableText = styled.div`
  position: absolute;
  cursor: ${(props) => (props.isDragging ? "grabbing" : "grab")};
  user-select: none;
  display: inline-block;
`;

const EditableDiv = styled.div`
  padding: 10px;
  /* box-sizing: border-box; */
  /* white-space: pre-wrap; */
  /* overflow: hidden; */
  font-size: ${(props) => props.fontSize}px;
  min-width: 10px;
  min-height: 10px;
  display: inline-block;
`;

const ResizeHandle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: #007bff;
  cursor: nwse-resize;
  right: 0;
  bottom: 0;
`;

const App = () => {
  const [texts, setTexts] = useState([
    {
      id: 1,
      top: 100,
      left: 100,
      text: "hello, woong",
      fontSize: 16,
      isEditing: false,
      isDragging: false,
    },
    {
      id: 2,
      top: 200,
      left: 200,
      text: "another text",
      fontSize: 16,
      isEditing: false,
      isDragging: false,
    },
  ]);

  const textRefs = useRef({});
  const isDraggingRef = useRef(false);

  const updateText = (id, updates) => {
    setTexts((prevTexts) =>
      prevTexts.map((text) => (text.id === id ? { ...text, ...updates } : text))
    );
  };

  const handleMouseDown = (id, e) => {
    isDraggingRef.current = false;
    //텍스트 편집 박스 드래그 방지(텍스트 복붙 버그 방지)
    if (texts.find((text) => text.id === id).isEditing) return;

    const text = texts.find((text) => text.id === id);
    const dragItem = {
      offsetX: e.clientX - text.left,
      offsetY: e.clientY - text.top,
    };

    const handleMouseMove = throttle((e) => {
      isDraggingRef.current = true;

      const newTop = e.clientY - dragItem.offsetY;
      const newLeft = e.clientX - dragItem.offsetX;

      if (newTop !== text.top || newLeft !== text.left) {
        updateText(id, {
          top: newTop,
          left: newLeft,
          isDragging: true,
        });
      }
    }, 10);

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        // 드래그가 발생한 경우 편집 모드로 전환하지 않음
        updateText(id, { isDragging: false });
      }
      window.removeEventListener("mousemove", handleMouseMove);
      // window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

const handleClick = (id) => {
  const text = texts.find((text) => text.id === id);
  
  if (!isDraggingRef.current && !text.isEditing) {
    // 드래그가 아닌 경우이면서 처음 편집 모드로 전환될 때만 실행
    updateText(id, { isEditing: true });
    
    setTimeout(() => {
      const el = textRefs.current[id];
      if (el) {
        el.focus();

        // 커서를 텍스트의 맨 뒤로 이동시키는 로직 (처음 편집할 때만)
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(el);
        range.collapse(false); // 커서를 끝으로 이동
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }, 0);
  } 
  // else if (text.isEditing) {
  //   // 이미 편집 중인 경우 커서를 유지하고 focus만
  //   textRefs.current[id]?.focus();
  // }
};


  const handleBlur = (id) => {
    const textContent = textRefs.current[id]?.innerHTML || "";
    const cleanedText = textContent
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/&nbsp;/g, " ");
    updateText(id, {
      isEditing: false,
      text: cleanedText,
    });
  };

  const handleResizeMouseDown = (id, e) => {
    e.preventDefault();
    e.stopPropagation();

    const text = texts.find((text) => text.id === id);
    const startWidth = text.width;
    const startHeight = text.height;
    const startX = e.clientX;
    const startY = e.clientY;
    console.log("startWidth :",startWidth, "startHeight :",startHeight)
    console.log(startX,startY)
    // const el = textRefs.current[id]; // EditableDiv의 참조 가져오기
    // if (el) {
    //   const computedStyle = window.getComputedStyle(el);
    //   console.log((computedStyle.width))
    //   const width = parseInt(computedStyle.width);
    //   const height = parseInt(computedStyle.height);
  
    //   // 콘솔에 현재 width와 height 출력
    //   console.log(`현재 EditableDiv의 width: ${width}, height: ${height}`);
    // }
    const handleResizeMouseMove = (e) => {
      const newWidth = Math.max(startWidth + (e.clientX - startX), 100);
      const newHeight = Math.max(startHeight + (e.clientY - startY), 30);
      const newFontSize = Math.max(Math.min(newWidth / 10, 32), 8);

      updateText(id, {
        width: newWidth,
        height: newHeight,
        fontSize: newFontSize,
      });
    };

    const handleResizeMouseUp = () => {
      window.removeEventListener("mousemove", handleResizeMouseMove);
      // window.removeEventListener("mouseup", handleResizeMouseUp);
    };

    window.addEventListener("mousemove", handleResizeMouseMove);
    window.addEventListener("mouseup", handleResizeMouseUp);
  };

  useEffect(() => {
    texts.forEach((text) => {
      const el = textRefs.current[text.id];
      if (el) {
        el.style.width = "auto"; // Reset width to auto
        el.style.height = "auto"; // Reset height to auto
        console.log(el.scrollWidth+10)
        const newWidth = Math.max(el.scrollWidth+10 , 100); // Add padding and ensure minimum width
        const newHeight = Math.max(el.scrollHeight+10, 30); // Add padding and ensure minimum height
        if (newWidth !== text.width || newHeight !== text.height) {
          updateText(text.id, {
            width: newWidth,
            height: newHeight,
          });
        }
      }
    });
  }, [texts]);

  // Helper function to convert spaces to &nbsp;
  const escapeHtml = (text) => {
    return text
      .replace(/ /g, "&nbsp;") // Convert space to &nbsp;
      .replace(/\n/g, "<br>"); // Convert newlines to <br>
  };

  return (
    <div>
      {texts.map((text) => (
        <DraggableText
          key={text.id}
          onMouseDown={(e) => handleMouseDown(text.id, e)}
          onClick={(e) => handleClick(text.id)}
          style={{
            top: text.top,
            left: text.left,
            cursor: text.isDragging ? "grabbing" : "grab", // style 속성으로만 사용
          }}
        >
          {text.isEditing ? (
            <EditableDiv
              ref={(el) => (textRefs.current[text.id] = el)}
              contentEditable
              onBlur={() => handleBlur(text.id)}
              // suppressContentEditableWarning
              fontSize={text.fontSize}
              dangerouslySetInnerHTML={{ __html: escapeHtml(text.text) }}
            />
          ) : (
            <span
              style={{ fontSize: text.fontSize }}
              dangerouslySetInnerHTML={{ __html: escapeHtml(text.text) }}
            />
          )}
          {text.isEditing && (
            <ResizeHandle
              onMouseDown={(e) => handleResizeMouseDown(text.id, e)}
            />
          )}
        </DraggableText>
      ))}
    </div>
  );
};

export default App;
