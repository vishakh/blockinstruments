#! /usr/bin/env python3
# Author: Kapil Thadani (kapil.thadani@gmail.com)

import argparse
import os
import subprocess
import tempfile


def replace_name(contract_name, line):
    """Replace name in contract line.
    """
    i = line.find(contract_name)
    return line[:i] + "Example" + line[i+len(contract_name):]

def read_contract(contract_path, replace=True):
    """Read a Solidity file and expand imported contracts recursively.
    """
    # Separate into path and file
    contract_dir, contract_file = os.path.split(contract_path)
    contract_name = contract_file[:-4]

    output_lines = []
    seen_libs = set()
    with open(contract_path) as f:
        for line in f:
            if line.startswith('import '):
                lib_name = line[line.find('"')+1:line.rfind('"')]
                lib_path = os.path.join(contract_dir, lib_name)
                if lib_path not in seen_libs:
                    output_lines.extend(read_contract(lib_path, replace=False))
                    output_lines.append('\n\n')
                    seen_libs.add(lib_path)
                    print("Importing", lib_name)
            elif replace and (line.startswith('contract ' + contract_name) or \
                              line.startswith('function ' + contract_name)):
                output_lines.append(replace_name(contract_name, line))
            else:
                output_lines.append(line)
    return output_lines


def deploy_contract(contract_path):
    """Compile and deploy a contract using truffle with imports expanded inline.
    """
    # Read the entry point contract, expanding imports inline
    output_lines = read_contract(contract_path)

    # Initiate a temporary truffle directory
    with tempfile.TemporaryDirectory() as truffle_dir:
        os.chdir(truffle_dir)
        subprocess.call('truffle init', shell=True)

        # Overwrite Example.sol in the truffle directory
        output_path = os.path.join(truffle_dir, 'contracts', 'Example.sol')
        with open(output_path, 'w') as f:
            f.writelines(output_lines)
        subprocess.call('truffle deploy', shell=True)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Compile and deploy contracts.')
    parser.add_argument('contract_path', help='path to .sol file')
    args = parser.parse_args()
    deploy_contract(args.contract_path)
