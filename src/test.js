// #1
// import React, { useState, useRef } from 'react';
// import styled from 'styled-components';

// const DraggableText = styled.div`
//   position: absolute;
//   cursor: ${(props) => (props.isDragging ? 'grabbing' : 'grab')};
//   user-select: none;
//   display: inline-block;
// `;

// const EditableDiv = styled.div`
//   outline: none;
//   border: ${(props) => (props.isEditing ? '1px solid #007bff' : '1px solid transparent')};
//   padding: 5px;
//   box-sizing: border-box;
//   white-space: pre-wrap; /* Preserve white spaces and line breaks */
// `;

// const App = () => {
//   const [position, setPosition] = useState({ top: 100, left: 100 });
//   const [text, setText] = useState('hello, woong');
//   const [isEditing, setIsEditing] = useState(false);
//   const [isDragging, setIsDragging] = useState(false);
//   const dragItem = useRef(null);
//   const textRef = useRef(null);
//   const clickTimeoutRef = useRef(null);

//   const handleMouseDown = (e) => {
//     if (isEditing) return; // Prevent dragging while editing

//     setIsDragging(true);
//     dragItem.current = {
//       offsetX: e.clientX - position.left,
//       offsetY: e.clientY - position.top,
//     };

//     const handleMouseMove = (e) => {
//       if (dragItem.current) {
//         setPosition({
//           left: e.clientX - dragItem.current.offsetX,
//           top: e.clientY - dragItem.current.offsetY,
//         });
//       }
//     };

//     const handleMouseUp = () => {
//       setIsDragging(false);
//       dragItem.current = null;
//       window.removeEventListener('mousemove', handleMouseMove);
//       window.removeEventListener('mouseup', handleMouseUp);
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     window.addEventListener('mouseup', handleMouseUp);
//   };

//   const handleClick = () => {
//     if (!isDragging) {
//       setIsEditing(true);
//       setTimeout(() => {
//         textRef.current.focus();
//       }, 0);
//     }
//   };

//   const handleBlur = () => {
//     setIsEditing(false);
//     setText(textRef.current.innerHTML.replace(/\n/g, '<br>'));
//   };

//   // Prevent drag while editing by overriding the default behavior of text selection
//   const handleDragStart = (e) => {
//     if (isEditing) e.preventDefault();
//   };

//   return (
//     <DraggableText
//       onMouseDown={handleMouseDown}
//       onDragStart={handleDragStart} // Handle drag start
//       style={{ top: position.top, left: position.left }}
//       isDragging={isDragging}
//     >
//       {isEditing ? (
//         <EditableDiv
//           ref={textRef}
//           contentEditable
//           onBlur={handleBlur}
//           suppressContentEditableWarning
//           isEditing={isEditing}
//           dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br>') }}
//         />
//       ) : (
//         <span onClick={handleClick} dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br>') }}></span>
//       )}
//     </DraggableText>
//   );
// };

// export default App;










// #2
// import React, { useState, useRef, useEffect } from "react";
// import styled from "styled-components";

// const DraggableText = styled.div`
//   position: absolute;
//   cursor: ${(props) => (props.isDragging ? "grabbing" : "grab")};
//   user-select: none;
//   display: inline-block;
// `;

// const EditableDiv = styled.div`
//   border: ${(props) =>
//     props.isEditing ? "1px solid #007bff" : "1px solid transparent"};
//   padding: 5px;
//   box-sizing: border-box;
//   white-space: pre-wrap; /* Preserve white spaces and line breaks */
//   overflow: hidden;
//   font-size: ${(props) => props.fontSize}px;
//   min-width: 100px; /* Ensure a minimum width */
//   min-height: 30px; /* Ensure a minimum height */
//   display: inline-block; /* Ensures it sizes to its content */
// `;

// const ResizeHandle = styled.div`
//   position: absolute;
//   width: 10px;
//   height: 10px;
//   background: #007bff;
//   cursor: nwse-resize;
//   right: 0;
//   bottom: 0;
// `;

// const App = () => {
//   const [texts, setTexts] = useState([
//     {
//       id: 1,
//       top: 100,
//       left: 100,
//       width: 200,
//       height: 50,
//       text: "hello, woong",
//       fontSize: 16,
//       isEditing: false,
//       isDragging: false,
//     },
//     {
//       id: 2,
//       top: 200,
//       left: 200,
//       width: 200,
//       height: 50,
//       text: "another text",
//       fontSize: 16,
//       isEditing: false,
//       isDragging: false,
//     },
//   ]);

//   const textRefs = useRef({});

//   const updateText = (id, updates) => {
//     setTexts((prevTexts) =>
//       prevTexts.map((text) => (text.id === id ? { ...text, ...updates } : text))
//     );
//   };

//   const handleMouseDown = (id, e) => {
//     if (texts.find((text) => text.id === id).isEditing) return;

//     const text = texts.find((text) => text.id === id);
//     const dragItem = {
//       offsetX: e.clientX - text.left,
//       offsetY: e.clientY - text.top,
//     };

//     const handleMouseMove = (e) => {
//       updateText(id, {
//         top: e.clientY - dragItem.offsetY,
//         left: e.clientX - dragItem.offsetX,
//         isDragging: true,
//       });
//     };

//     const handleMouseUp = () => {
//       updateText(id, { isDragging: false });
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleClick = (id) => {
//     updateText(id, { isEditing: true });
//     setTimeout(() => {
//       textRefs.current[id]?.focus();
//     }, 0);
//   };

//   const handleBlur = (id) => {
//     const textContent = textRefs.current[id]?.innerText || "";
//     updateText(id, {
//       isEditing: false,
//       text: textContent.replace(/\n/g, "<br>"), // Store text with <br> for line breaks
//     });
//   };

//   const handleResizeMouseDown = (id, e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const text = texts.find((text) => text.id === id);
//     const startWidth = text.width;
//     const startHeight = text.height;
//     const startX = e.clientX;
//     const startY = e.clientY;

//     const handleResizeMouseMove = (e) => {
//       const newWidth = Math.max(startWidth + (e.clientX - startX), 100);
//       const newHeight = Math.max(startHeight + (e.clientY - startY), 30);
//       const newFontSize = Math.max(Math.min(newWidth / 10, 32), 8);

//       updateText(id, {
//         width: newWidth,
//         height: newHeight,
//         fontSize: newFontSize,
//       });
//     };

//     const handleResizeMouseUp = () => {
//       window.removeEventListener("mousemove", handleResizeMouseMove);
//       window.removeEventListener("mouseup", handleResizeMouseUp);
//     };

//     window.addEventListener("mousemove", handleResizeMouseMove);
//     window.addEventListener("mouseup", handleResizeMouseUp);
//   };

//   useEffect(() => {
//     texts.forEach((text) => {
//       const el = textRefs.current[text.id];
//       if (el) {
//         el.style.width = "auto"; // Reset width to auto
//         el.style.height = "auto"; // Reset height to auto
//         const computedStyle = getComputedStyle(el);
//         const newWidth = Math.max(el.scrollWidth + 10, 100); // Add padding and ensure minimum width
//         const newHeight = Math.max(el.scrollHeight + 10, 30); // Add padding and ensure minimum height
//         updateText(text.id, {
//           width: newWidth,
//           height: newHeight,
//         });
//       }
//     });
//   }, [texts]);

//   return (
//     <div>
//       {texts.map((text) => (
//         <DraggableText
//           key={text.id}
//           onMouseDown={(e) => handleMouseDown(text.id, e)}
//           onClick={(e) => handleClick(text.id)}
//           style={{
//             top: text.top,
//             left: text.left,
//             width: text.width,
//             height: text.height,
//           }}
//           isDragging={text.isDragging}
//         >
//           {text.isEditing ? (
//             <EditableDiv
//               ref={(el) => (textRefs.current[text.id] = el)}
//               contentEditable
//               onBlur={() => handleBlur(text.id)}
//               suppressContentEditableWarning
//               fontSize={text.fontSize}
//               // Preserve line breaks in the div
//               dangerouslySetInnerHTML={{ __html: text.text }}
//             />
//           ) : (
//             <span
//               style={{ fontSize: text.fontSize }}
//               dangerouslySetInnerHTML={{ __html: text.text }}
//             />
//           )}
//           {text.isEditing && (
//             <ResizeHandle
//               onMouseDown={(e) => handleResizeMouseDown(text.id, e)}
//             />
//           )}
//         </DraggableText>
//       ))}
//     </div>
//   );
// };

// export default App;



// #3
// import React, { useState, useRef, useEffect } from "react";
// import styled from "styled-components";

// const DraggableText = styled.div`
//   position: absolute;
//   cursor: ${(props) => (props.isDragging ? "grabbing" : "grab")};
//   user-select: none;
//   display: inline-block;
// `;

// const EditableDiv = styled.div`
//   border: ${(props) =>
//     props.isEditing ? "1px solid #007bff" : "1px solid transparent"};
//   padding: 5px;
//   box-sizing: border-box;
//   white-space: pre-wrap; /* Preserve white spaces and line breaks */
//   overflow: hidden;
//   font-size: ${(props) => props.fontSize}px;
//   min-width: 100px; /* Ensure a minimum width */
//   min-height: 30px; /* Ensure a minimum height */
//   display: inline-block; /* Ensures it sizes to its content */
// `;

// const ResizeHandle = styled.div`
//   position: absolute;
//   width: 10px;
//   height: 10px;
//   background: #007bff;
//   cursor: nwse-resize;
//   right: 0;
//   bottom: 0;
// `;

// const App = () => {
//   const [texts, setTexts] = useState([
//     {
//       id: 1,
//       top: 100,
//       left: 100,
//       width: 200,
//       height: 50,
//       text: "hello, woong",
//       fontSize: 16,
//       isEditing: false,
//       isDragging: false,
//     },
//     {
//       id: 2,
//       top: 200,
//       left: 200,
//       width: 200,
//       height: 50,
//       text: "another text",
//       fontSize: 16,
//       isEditing: false,
//       isDragging: false,
//     },
//   ]);

//   const textRefs = useRef({});

//   const updateText = (id, updates) => {
//     setTexts((prevTexts) =>
//       prevTexts.map((text) => (text.id === id ? { ...text, ...updates } : text))
//     );
//   };

//   const handleMouseDown = (id, e) => {
//     if (texts.find((text) => text.id === id).isEditing) return;

//     const text = texts.find((text) => text.id === id);
//     const dragItem = {
//       offsetX: e.clientX - text.left,
//       offsetY: e.clientY - text.top,
//     };

//     const handleMouseMove = (e) => {
//       updateText(id, {
//         top: e.clientY - dragItem.offsetY,
//         left: e.clientX - dragItem.offsetX,
//         isDragging: true,
//       });
//     };

//     const handleMouseUp = () => {
//       updateText(id, { isDragging: false });
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleClick = (id) => {
//     updateText(id, { isEditing: true });
//     setTimeout(() => {
//       textRefs.current[id]?.focus();
//     }, 0);
//   };

//   const handleBlur = (id) => {
//     const textContent = textRefs.current[id]?.innerHTML || "";
//     // Replace <br> with newlines and &nbsp; with spaces for saving
//     const cleanedText = textContent
//       .replace(/<br\s*\/?>/gi, "\n")
//       .replace(/&nbsp;/g, " ");
//     updateText(id, {
//       isEditing: false,
//       text: cleanedText, // Save text with newlines
//     });
//   };

//   const handleResizeMouseDown = (id, e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const text = texts.find((text) => text.id === id);
//     const startWidth = text.width;
//     const startHeight = text.height;
//     const startX = e.clientX;
//     const startY = e.clientY;

//     const handleResizeMouseMove = (e) => {
//       const newWidth = Math.max(startWidth + (e.clientX - startX), 100);
//       const newHeight = Math.max(startHeight + (e.clientY - startY), 30);
//       const newFontSize = Math.max(Math.min(newWidth / 10, 32), 8);

//       updateText(id, {
//         width: newWidth,
//         height: newHeight,
//         fontSize: newFontSize,
//       });
//     };

//     const handleResizeMouseUp = () => {
//       window.removeEventListener("mousemove", handleResizeMouseMove);
//       window.removeEventListener("mouseup", handleResizeMouseUp);
//     };

//     window.addEventListener("mousemove", handleResizeMouseMove);
//     window.addEventListener("mouseup", handleResizeMouseUp);
//   };

//   useEffect(() => {
//     texts.forEach((text) => {
//       const el = textRefs.current[text.id];
//       if (el) {
//         el.style.width = "auto"; // Reset width to auto
//         el.style.height = "auto"; // Reset height to auto
//         const computedStyle = getComputedStyle(el);
//         const newWidth = Math.max(el.scrollWidth + 10, 100); // Add padding and ensure minimum width
//         const newHeight = Math.max(el.scrollHeight + 10, 30); // Add padding and ensure minimum height
//         updateText(text.id, {
//           width: newWidth,
//           height: newHeight,
//         });
//       }
//     });
//   }, [texts]);

//   // Helper function to convert spaces to &nbsp;
//   const escapeHtml = (text) => {
//     return text
//       .replace(/ /g, "&nbsp;") // Convert space to &nbsp;
//       .replace(/\n/g, "<br>"); // Convert newlines to <br>
//   };

//   return (
//     <div>
//       {texts.map((text) => (
//         <DraggableText
//           key={text.id}
//           onMouseDown={(e) => handleMouseDown(text.id, e)}
//           onClick={(e) => handleClick(text.id)}
//           style={{
//             top: text.top,
//             left: text.left,
//             width: text.width,
//             height: text.height,
//           }}
//           isDragging={text.isDragging}
//         >
//           {text.isEditing ? (
//             <EditableDiv
//               ref={(el) => (textRefs.current[text.id] = el)}
//               contentEditable
//               onBlur={() => handleBlur(text.id)}
//               suppressContentEditableWarning
//               fontSize={text.fontSize}
//               // Preserve spaces and line breaks by using escaped HTML
//               dangerouslySetInnerHTML={{ __html: escapeHtml(text.text) }}
//             />
//           ) : (
//             <span
//               style={{ fontSize: text.fontSize }}
//               dangerouslySetInnerHTML={{ __html: escapeHtml(text.text) }}
//             />
//           )}
//           {text.isEditing && (
//             <ResizeHandle
//               onMouseDown={(e) => handleResizeMouseDown(text.id, e)}
//             />
//           )}
//         </DraggableText>
//       ))}
//     </div>
//   );
// };

// export default App;





// #4
// import React, { useState, useRef, useEffect } from "react";
// import styled from "styled-components";

// const DraggableText = styled.div`
//   position: absolute;
//   cursor: ${(props) => (props.isDragging ? "grabbing" : "grab")};
//   /* user-select: none; */
//   display: inline-block;
// `;

// const EditableDiv = styled.div`
//   padding: 5px;
//   box-sizing: border-box;
//   white-space: pre-wrap; /* Preserve white spaces and line breaks */
//   overflow: hidden;
//   font-size: ${(props) => props.fontSize}px;
//   min-width: 10px; /* Ensure a minimum width */
//   min-height: 10px; /* Ensure a minimum height */
//   display: inline-block; /* Ensures it sizes to its content */
// `;

// const ResizeHandle = styled.div`
//   position: absolute;
//   width: 10px;
//   height: 10px;
//   background: #007bff;
//   cursor: nwse-resize;
//   right: 0;
//   bottom: 0;
// `;

// const App = () => {
//   const [texts, setTexts] = useState([
//     {
//       id: 1,
//       top: 100,
//       left: 100,
//       width: 200,
//       height: 50,
//       text: "hello, woong",
//       fontSize: 16,
//       isEditing: false,
//       isDragging: false,
//     },
//     {
//       id: 2,
//       top: 200,
//       left: 200,
//       width: 200,
//       height: 50,
//       text: "another text",
//       fontSize: 16,
//       isEditing: false,
//       isDragging: false,
//     },
//   ]);

//   const textRefs = useRef({});

//   const updateText = (id, updates) => {
//     setTexts((prevTexts) =>
//       prevTexts.map((text) => (text.id === id ? { ...text, ...updates } : text))
//     );
//   };

//   const handleMouseDown = (id, e) => {
//     if (texts.find((text) => text.id === id).isEditing) return;

//     const text = texts.find((text) => text.id === id);
//     const dragItem = {
//       offsetX: e.clientX - text.left,
//       offsetY: e.clientY - text.top,
//     };

//     const handleMouseMove = (e) => {
//       updateText(id, {
//         top: e.clientY - dragItem.offsetY,
//         left: e.clientX - dragItem.offsetX,
//         isDragging: true,
//       });
//     };

//     const handleMouseUp = () => {
//       updateText(id, { isDragging: false });
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleClick = (id) => {
//     updateText(id, { isEditing: true });
//     setTimeout(() => {
//       textRefs.current[id]?.focus();
//     }, 0);
//   };

//   const handleBlur = (id) => {
//     const textContent = textRefs.current[id]?.innerHTML || "";
//     // Replace <br> with newlines and &nbsp; with spaces for saving
//     const cleanedText = textContent
//       .replace(/<br\s*\/?>/gi, "\n")
//       .replace(/&nbsp;/g, " ");
//     updateText(id, {
//       isEditing: false,
//       text: cleanedText, // Save text with newlines
//     });
//   };

//   const handleResizeMouseDown = (id, e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const text = texts.find((text) => text.id === id);
//     const startWidth = text.width;
//     const startHeight = text.height;
//     const startX = e.clientX;
//     const startY = e.clientY;

//     const handleResizeMouseMove = (e) => {
//       const newWidth = Math.max(startWidth + (e.clientX - startX), 100);
//       const newHeight = Math.max(startHeight + (e.clientY - startY), 30);
//       const newFontSize = Math.max(Math.min(newWidth / 10, 32), 8);

//       updateText(id, {
//         width: newWidth,
//         height: newHeight,
//         fontSize: newFontSize,
//       });
//     };

//     const handleResizeMouseUp = () => {
//       window.removeEventListener("mousemove", handleResizeMouseMove);
//       window.removeEventListener("mouseup", handleResizeMouseUp);
//     };

//     window.addEventListener("mousemove", handleResizeMouseMove);
//     window.addEventListener("mouseup", handleResizeMouseUp);
//   };

//   useEffect(() => {
//     texts.forEach((text) => {
//       const el = textRefs.current[text.id];
//       if (el) {
//         el.style.width = "auto"; // Reset width to auto
//         el.style.height = "auto"; // Reset height to auto
//         const computedStyle = getComputedStyle(el);
//         const newWidth = Math.max(el.scrollWidth + 10, 0); // Add padding and ensure minimum width
//         const newHeight = Math.max(el.scrollHeight + 10, 30); // Add padding and ensure minimum height
//         updateText(text.id, {
//           width: newWidth,
//           height: newHeight,
//         });
//       }
//     });
//   }, [texts]);

//   // Helper function to convert spaces to &nbsp;
//   const escapeHtml = (text) => {
//     return text
//       .replace(/ /g, "&nbsp;") // Convert space to &nbsp;
//       .replace(/\n/g, "<br>"); // Convert newlines to <br>
//   };

//   return (
//     <div>
//       {texts.map((text) => (
//         <DraggableText
//           key={text.id}
//           onMouseDown={(e) => handleMouseDown(text.id, e)}
//           onClick={(e) => handleClick(text.id)}
//           style={{
//             top: text.top,
//             left: text.left,
//             width: text.width,
//             height: text.height,
//             cursor: text.isDragging ? "grabbing" : "grab", // style 속성으로만 사용
//           }}
//         >
//           {text.isEditing ? (
//             <EditableDiv
//               ref={(el) => (textRefs.current[text.id] = el)}
//               contentEditable
//               onBlur={() => handleBlur(text.id)}
//               suppressContentEditableWarning
//               fontSize={text.fontSize}
//               // Preserve spaces and line breaks by using escaped HTML
//               dangerouslySetInnerHTML={{ __html: escapeHtml(text.text) }}
//             />
//           ) : (
//             <span
//               style={{ fontSize: text.fontSize }}
//               dangerouslySetInnerHTML={{ __html: escapeHtml(text.text) }}
//             />
//           )}
//           {text.isEditing && (
//             <ResizeHandle
//               onMouseDown={(e) => handleResizeMouseDown(text.id, e)}
//             />
//           )}
//         </DraggableText>
//       ))}
//     </div>
//   );
// };

// export default App;







// #5
// import React, { useState, useRef, useEffect } from "react";
// import styled from "styled-components";
// import { throttle } from "lodash"; // lodash에서 throttle 사용

// const DraggableText = styled.div`
//   position: absolute;
//   cursor: ${(props) => (props.isDragging ? "grabbing" : "grab")};
//   /* user-select: none; */
//   display: inline-block;
// `;

// const EditableDiv = styled.div`
//   padding: 5px;
//   box-sizing: border-box;
//   white-space: pre-wrap; /* Preserve white spaces and line breaks */
//   overflow: hidden;
//   font-size: ${(props) => props.fontSize}px;
//   min-width: 10px; /* Ensure a minimum width */
//   min-height: 10px; /* Ensure a minimum height */
//   display: inline-block; /* Ensures it sizes to its content */
// `;

// const ResizeHandle = styled.div`
//   position: absolute;
//   width: 10px;
//   height: 10px;
//   background: #007bff;
//   cursor: nwse-resize;
//   right: 0;
//   bottom: 0;
// `;

// const App = () => {
//   const [texts, setTexts] = useState([
//     {
//       id: 1,
//       top: 100,
//       left: 100,
//       width: 200,
//       height: 50,
//       text: "hello, woong",
//       fontSize: 16,
//       isEditing: false,
//       isDragging: false,
//     },
//     {
//       id: 2,
//       top: 200,
//       left: 200,
//       width: 200,
//       height: 50,
//       text: "another text",
//       fontSize: 16,
//       isEditing: false,
//       isDragging: false,
//     },
//   ]);

//   const textRefs = useRef({});

//   const updateText = (id, updates) => {
//     setTexts((prevTexts) =>
//       prevTexts.map((text) => (text.id === id ? { ...text, ...updates } : text))
//     );
//   };

//   const handleMouseDown = (id, e) => {
//     if (texts.find((text) => text.id === id).isEditing) return;

//     const text = texts.find((text) => text.id === id);
//     const dragItem = {
//       offsetX: e.clientX - text.left,
//       offsetY: e.clientY - text.top,
//     };

//     const handleMouseMove = throttle((e) => {
//       const newTop = e.clientY - dragItem.offsetY;
//       const newLeft = e.clientX - dragItem.offsetX;

//       if (newTop !== text.top || newLeft !== text.left) {
//         updateText(id, {
//           top: newTop,
//           left: newLeft,
//           isDragging: true,
//         });
//       }
//     }, 100); // 100ms에 한 번만 호출

//     const handleMouseUp = () => {
//       updateText(id, { isDragging: false });
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleClick = (id) => {
//     updateText(id, { isEditing: true });
//     setTimeout(() => {
//       textRefs.current[id]?.focus();
//     }, 0);
//   };

//   const handleBlur = (id) => {
//     const textContent = textRefs.current[id]?.innerHTML || "";
//     // Replace <br> with newlines and &nbsp; with spaces for saving
//     const cleanedText = textContent
//       .replace(/<br\s*\/?>/gi, "\n")
//       .replace(/&nbsp;/g, " ");
//     updateText(id, {
//       isEditing: false,
//       text: cleanedText, // Save text with newlines
//     });
//   };

//   const handleResizeMouseDown = (id, e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const text = texts.find((text) => text.id === id);
//     const startWidth = text.width;
//     const startHeight = text.height;
//     const startX = e.clientX;
//     const startY = e.clientY;
//     console.log(`text : ${text} 
//     startWidth : ${startWidth} 
//     startHeight : ${startHeight}
//     startX : ${startX}
//     startY : ${startY}
//     `)
//     const handleResizeMouseMove = (e) => {
//       const newWidth = Math.max(startWidth + (e.clientX - startX), 100);
//       const newHeight = Math.max(startHeight + (e.clientY - startY), 30);
//       const newFontSize = Math.max(Math.min(newWidth / 10, 32), 8);

//       updateText(id, {
//         width: newWidth,
//         height: newHeight,
//         fontSize: newFontSize,
//       });
//     };

//     const handleResizeMouseUp = () => {
//       window.removeEventListener("mousemove", handleResizeMouseMove);
//       window.removeEventListener("mouseup", handleResizeMouseUp);
//     };

//     window.addEventListener("mousemove", handleResizeMouseMove);
//     window.addEventListener("mouseup", handleResizeMouseUp);
//   };

//   useEffect(() => {
//     texts.forEach((text) => {
//       const el = textRefs.current[text.id];
//       if (el) {
//         el.style.width = "auto"; // Reset width to auto
//         el.style.height = "auto"; // Reset height to auto
//         const computedStyle = getComputedStyle(el);
//         const newWidth = Math.max(el.scrollWidth + 10, 0); // Add padding and ensure minimum width
//         const newHeight = Math.max(el.scrollHeight + 10, 30); // Add padding and ensure minimum height
//         if (newWidth !== text.width || newHeight !== text.height) {
//           updateText(text.id, {
//             width: newWidth,
//             height: newHeight,
//           });
//         }
//       }
//     });
//   }, [texts]);

//   // Helper function to convert spaces to &nbsp;
//   const escapeHtml = (text) => {
//     return text
//       .replace(/ /g, "&nbsp;") // Convert space to &nbsp;
//       .replace(/\n/g, "<br>"); // Convert newlines to <br>
//   };

//   return (
//     <div>
//       {texts.map((text) => (
//         <DraggableText
//           key={text.id}
//           onMouseDown={(e) => handleMouseDown(text.id, e)}
//           onClick={(e) => handleClick(text.id)}
//           style={{
//             top: text.top,
//             left: text.left,
//             width: text.width,
//             height: text.height,
//             cursor: text.isDragging ? "grabbing" : "grab", // style 속성으로만 사용
//           }}
//         >
//           {text.isEditing ? (
//             <EditableDiv
//               ref={(el) => (textRefs.current[text.id] = el)}
//               contentEditable
//               onBlur={() => handleBlur(text.id)}
//               suppressContentEditableWarning
//               fontSize={text.fontSize}
//               // Preserve spaces and line breaks by using escaped HTML
//               dangerouslySetInnerHTML={{ __html: escapeHtml(text.text) }}
//             />
//           ) : (
//             <span
//               style={{ fontSize: text.fontSize }}
//               dangerouslySetInnerHTML={{ __html: escapeHtml(text.text) }}
//             />
//           )}
//           {text.isEditing && (
//             <ResizeHandle
//               onMouseDown={(e) => handleResizeMouseDown(text.id, e)}
//             />
//           )}
//         </DraggableText>
//       ))}
//     </div>
//   );
// };

// export default App;



















// #6
// import React, { useState, useRef, useEffect } from "react";
// import styled from "styled-components";
// import { throttle } from "lodash"; // lodash에서 throttle 사용


// const DraggableText = styled.div`
//   position: absolute;
//   cursor: ${(props) => (props.isDragging ? "grabbing" : "grab")};
//   /* user-select: none; */
//   display: inline-block;
// `;

// const EditableDiv = styled.div`
//   padding: 5px;
//   box-sizing: border-box;
//   white-space: pre-wrap; /* Preserve white spaces and line breaks */
//   overflow: hidden;
//   font-size: ${(props) => props.fontSize}px;
//   min-width: 10px; /* Ensure a minimum width */
//   min-height: 10px; /* Ensure a minimum height */
//   display: inline-block; /* Ensures it sizes to its content */
// `;

// const ResizeHandle = styled.div`
//   position: absolute;
//   width: 10px;
//   height: 10px;
//   background: #007bff;
//   cursor: nwse-resize;
//   right: 0;
//   bottom: 0;
// `;

// const App = () => {
//   const [texts, setTexts] = useState([
//     {
//       id: 1,
//       top: 100,
//       left: 100,
//       width: 200,
//       height: 50,
//       text: "hello, woong",
//       fontSize: 16,
//       isEditing: false,
//       isDragging: false,
//     },
//     {
//       id: 2,
//       top: 200,
//       left: 200,
//       width: 200,
//       height: 50,
//       text: "another text",
//       fontSize: 16,
//       isEditing: false,
//       isDragging: false,
//     },
//   ]);

//   const textRefs = useRef({});

//   const updateText = (id, updates) => {
//     setTexts((prevTexts) =>
//       prevTexts.map((text) => (text.id === id ? { ...text, ...updates } : text))
//     );
//   };

//   const handleMouseDown = (id, e) => {
//     if (texts.find((text) => text.id === id).isEditing) return;

//     const text = texts.find((text) => text.id === id);
//     const dragItem = {
//       offsetX: e.clientX - text.left,
//       offsetY: e.clientY - text.top,
//     };

//     const handleMouseMove = throttle((e) => {
//       const newTop = e.clientY - dragItem.offsetY;
//       const newLeft = e.clientX - dragItem.offsetX;

//       if (newTop !== text.top || newLeft !== text.left) {
//         updateText(id, {
//           top: newTop,
//           left: newLeft,
//           isDragging: true,
//         });
//       }
//     }, 10); // 10ms에 한 번만 호출

//     const handleMouseUp = () => {
//       updateText(id, { isDragging: false });
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleClick = (id) => {
//     updateText(id, { isEditing: true });
//     setTimeout(() => {
//       textRefs.current[id]?.focus();
//     }, 0);
//   };

//   const handleBlur = (id) => {
//     const textContent = textRefs.current[id]?.innerHTML || "";
//     // Replace <br> with newlines and &nbsp; with spaces for saving
//     const cleanedText = textContent
//       .replace(/<br\s*\/?>/gi, "\n")
//       .replace(/&nbsp;/g, " ");
//     updateText(id, {
//       isEditing: false,
//       text: cleanedText, // Save text with newlines
//     });
//   };

//   const handleResizeMouseDown = (id, e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const text = texts.find((text) => text.id === id);
//     const startWidth = text.width;
//     const startHeight = text.height;
//     const startX = e.clientX;
//     const startY = e.clientY;

//     const handleResizeMouseMove = (e) => {
//       const newWidth = Math.max(startWidth + (e.clientX - startX), 100);
//       const newHeight = Math.max(startHeight + (e.clientY - startY), 30);
//       const newFontSize = Math.max(Math.min(newWidth / 10, 32), 8);

//       updateText(id, {
//         width: newWidth,
//         height: newHeight,
//         fontSize: newFontSize,
//       });
//     };

//     const handleResizeMouseUp = () => {
//       window.removeEventListener("mousemove", handleResizeMouseMove);
//       window.removeEventListener("mouseup", handleResizeMouseUp);
//     };

//     window.addEventListener("mousemove", handleResizeMouseMove);
//     window.addEventListener("mouseup", handleResizeMouseUp);
//   };

//   useEffect(() => {
//     texts.forEach((text) => {
//       const el = textRefs.current[text.id];
//       if (el) {
//         el.style.width = "auto"; // Reset width to auto
//         el.style.height = "auto"; // Reset height to auto
//         const computedStyle = getComputedStyle(el);
//         const newWidth = Math.max(el.scrollWidth + 10, 0); // Add padding and ensure minimum width
//         const newHeight = Math.max(el.scrollHeight + 10, 30); // Add padding and ensure minimum height
//         if (newWidth !== text.width || newHeight !== text.height) {
//           updateText(text.id, {
//             width: newWidth,
//             height: newHeight,
//           });
//         }
//       }
//     });
//   }, [texts]);

//   // Helper function to convert spaces to &nbsp;
//   const escapeHtml = (text) => {
//     return text
//       .replace(/ /g, "&nbsp;") // Convert space to &nbsp;
//       .replace(/\n/g, "<br>"); // Convert newlines to <br>
//   };

//   return (
//     <div>
//       {texts.map((text) => (
//         <DraggableText
//           key={text.id}
//           onMouseDown={(e) => handleMouseDown(text.id, e)}
//           onClick={(e) => handleClick(text.id)}
//           style={{
//             top: text.top,
//             left: text.left,
//             width: text.width,
//             height: text.height,
//             cursor: text.isDragging ? "grabbing" : "grab", // style 속성으로만 사용
//           }}
//         >
//           {text.isEditing ? (
//             <EditableDiv
//               ref={(el) => (textRefs.current[text.id] = el)}
//               contentEditable
//               onBlur={() => handleBlur(text.id)}
//               suppressContentEditableWarning
//               fontSize={text.fontSize}
//               // Preserve spaces and line breaks by using escaped HTML
//               dangerouslySetInnerHTML={{ __html: escapeHtml(text.text) }}
//             />
//           ) : (
//             <span
//               style={{ fontSize: text.fontSize }}
//               dangerouslySetInnerHTML={{ __html: escapeHtml(text.text) }}
//             />
//           )}
//           {text.isEditing && (
//             <ResizeHandle
//               onMouseDown={(e) => handleResizeMouseDown(text.id, e)}
//             />
//           )}
//         </DraggableText>
//       ))}
//     </div>
//   );
// };

// export default App;


























// # 크기 급격히 줄어드는것만 해결 못함
// import React, { useState, useRef, useEffect } from "react";
// import styled from "styled-components";
// import { throttle } from "lodash"; // lodash에서 throttle 사용


// const DraggableText = styled.div`
//   position: absolute;
//   cursor: ${(props) => (props.isDragging ? "grabbing" : "grab")};
//   /* user-select: none; */
//   display: inline-block;
// `;

// const EditableDiv = styled.div`
//   padding: 5px;
//   box-sizing: border-box;
//   white-space: pre-wrap; /* Preserve white spaces and line breaks */
//   overflow: hidden;
//   font-size: ${(props) => props.fontSize}px;
//   min-width: 10px; /* Ensure a minimum width */
//   min-height: 10px; /* Ensure a minimum height */
//   display: inline-block; /* Ensures it sizes to its content */
// `;

// const ResizeHandle = styled.div`
//   position: absolute;
//   width: 10px;
//   height: 10px;
//   background: #007bff;
//   cursor: nwse-resize;
//   right: 0;
//   bottom: 0;
// `;

// const App = () => {
//   const [texts, setTexts] = useState([
//     {
//       id: 1,
//       top: 100,
//       left: 100,
//       width: 200,
//       height: 50,
//       text: "hello, woong",
//       fontSize: 16,
//       isEditing: false,
//       isDragging: false,
//     },
//     {
//       id: 2,
//       top: 200,
//       left: 200,
//       width: 200,
//       height: 50,
//       text: "another text",
//       fontSize: 16,
//       isEditing: false,
//       isDragging: false,
//     },
//   ]);

//   const textRefs = useRef({});

//   const updateText = (id, updates) => {
//     setTexts((prevTexts) =>
//       prevTexts.map((text) => (text.id === id ? { ...text, ...updates } : text))
//     );
//   };

//   const handleMouseDown = (id, e) => {
//     if (texts.find((text) => text.id === id).isEditing) return;

//     const text = texts.find((text) => text.id === id);
//     const dragItem = {
//       offsetX: e.clientX - text.left,
//       offsetY: e.clientY - text.top,
//     };

//     const handleMouseMove = throttle((e) => {
//       const newTop = e.clientY - dragItem.offsetY;
//       const newLeft = e.clientX - dragItem.offsetX;

//       if (newTop !== text.top || newLeft !== text.left) {
//         updateText(id, {
//           top: newTop,
//           left: newLeft,
//           isDragging: true,
//         });
//       }
//     }, 10); // 10ms에 한 번만 호출

//     const handleMouseUp = () => {
//       updateText(id, { isDragging: false });
//       window.removeEventListener("mousemove", handleMouseMove);
//       window.removeEventListener("mouseup", handleMouseUp);
//     };

//     window.addEventListener("mousemove", handleMouseMove);
//     window.addEventListener("mouseup", handleMouseUp);
//   };

//   const handleClick = (id) => {
//     updateText(id, { isEditing: true });
//     setTimeout(() => {
//       textRefs.current[id]?.focus();
//     }, 0);
//   };

//   const handleBlur = (id) => {
//     const textContent = textRefs.current[id]?.innerHTML || "";
//     // Replace <br> with newlines and &nbsp; with spaces for saving
//     const cleanedText = textContent
//       .replace(/<br\s*\/?>/gi, "\n")
//       .replace(/&nbsp;/g, " ");
//     updateText(id, {
//       isEditing: false,
//       text: cleanedText, // Save text with newlines
//     });
//   };

//   const handleResizeMouseDown = (id, e) => {
//     e.preventDefault();
//     e.stopPropagation();

//     const text = texts.find((text) => text.id === id);
//     const startWidth = text.width;
//     const startHeight = text.height;
//     const startX = e.clientX;
//     const startY = e.clientY;

//     const handleResizeMouseMove = (e) => {
//       const newWidth = Math.max(startWidth + (e.clientX - startX), 100);
//       const newHeight = Math.max(startHeight + (e.clientY - startY), 30);
//       const newFontSize = Math.max(Math.min(newWidth / 10, 32), 8);

//       updateText(id, {
//         width: newWidth,
//         height: newHeight,
//         fontSize: newFontSize,
//       });
//     };

//     const handleResizeMouseUp = () => {
//       window.removeEventListener("mousemove", handleResizeMouseMove);
//       window.removeEventListener("mouseup", handleResizeMouseUp);
//     };

//     window.addEventListener("mousemove", handleResizeMouseMove);
//     window.addEventListener("mouseup", handleResizeMouseUp);
//   };

//   useEffect(() => {
//     texts.forEach((text) => {
//       const el = textRefs.current[text.id];
//       if (el) {
//         el.style.width = "auto"; // Reset width to auto
//         el.style.height = "auto"; // Reset height to auto
//         const computedStyle = getComputedStyle(el);
//         const newWidth = Math.max(el.scrollWidth + 10, 0); // Add padding and ensure minimum width
//         const newHeight = Math.max(el.scrollHeight + 10, 30); // Add padding and ensure minimum height
//         if (newWidth !== text.width || newHeight !== text.height) {
//           updateText(text.id, {
//             width: newWidth,
//             height: newHeight,
//           });
//         }
//       }
//     });
//   }, [texts]);

//   // Helper function to convert spaces to &nbsp;
//   const escapeHtml = (text) => {
//     return text
//       .replace(/ /g, "&nbsp;") // Convert space to &nbsp;
//       .replace(/\n/g, "<br>"); // Convert newlines to <br>
//   };

//   return (
//     <div>
//       {texts.map((text) => (
//         <DraggableText
//           key={text.id}
//           onMouseDown={(e) => handleMouseDown(text.id, e)}
//           onClick={(e) => handleClick(text.id)}
//           style={{
//             top: text.top,
//             left: text.left,
//             width: text.width,
//             height: text.height,
//             cursor: text.isDragging ? "grabbing" : "grab", // style 속성으로만 사용
//           }}
//         >
//           {text.isEditing ? (
//             <EditableDiv
//               ref={(el) => (textRefs.current[text.id] = el)}
//               contentEditable
//               onBlur={() => handleBlur(text.id)}
//               suppressContentEditableWarning
//               fontSize={text.fontSize}
//               // Preserve spaces and line breaks by using escaped HTML
//               dangerouslySetInnerHTML={{ __html: escapeHtml(text.text) }}
//             />
//           ) : (
//             <span
//               style={{ fontSize: text.fontSize }}
//               dangerouslySetInnerHTML={{ __html: escapeHtml(text.text) }}
//             />
//           )}
//           {text.isEditing && (
//             <ResizeHandle
//               onMouseDown={(e) => handleResizeMouseDown(text.id, e)}
//             />
//           )}
//         </DraggableText>
//       ))}
//     </div>
//   );
// };

// export default App;