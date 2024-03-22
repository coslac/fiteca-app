import React from "react";
import "./vsl-tag-list.scss";

import {Col, Row} from "reactstrap";

const TagList = ({
  lists,
  handleKeyDown,
  removeTag,
  invalid,
  field,
  hasError,
}) => {
  return (
    <Row>
      <Col>
        <div className="outer-list-input-container">
          <div className={`inner-list-input-container ${hasError}`}>
            {lists.map(({ nome }, index) => (
              <div className="list-item" key={index}>
                <span className="text">{nome}</span>
                <span
                  className="close"
                  onClick={() => removeTag(index)}
                  onKeyDown={() => handleKeyDown(index)}
                >
                  &times;
                </span>
              </div>
            ))}
            <input
              onKeyDown={handleKeyDown}
              type="text"
              className="list-input"
              placeholder=""
            />
          </div>
        </div>
      </Col>
    </Row>
  );
};

TagList.propTypes = {};

export default TagList;
